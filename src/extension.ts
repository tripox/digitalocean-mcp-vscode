// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// SECURITY NOTE: This extension uses hardcoded command execution to prevent
// arbitrary code execution vulnerabilities. The MCP server command and arguments
// are NOT user-configurable to maintain security. Only the official 
// @digitalocean/mcp package is executed via npx.

// Lightweight logging utility for structured logging
class Logger {
    constructor(private outputChannel: vscode.OutputChannel, private moduleName: string) {}

    private formatMessage(level: string, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [MCP Tools for DigitalOcean (Unofficial)] [${this.moduleName}] [${level}] ${message}`;
    }

    info(message: string): void {
        this.outputChannel.appendLine(this.formatMessage('INFO', message));
    }

    warn(message: string): void {
        this.outputChannel.appendLine(this.formatMessage('WARN', message));
    }

    error(message: string): void {
        this.outputChannel.appendLine(this.formatMessage('ERROR', message));
    }

    debug(message: string): void {
        // Only log debug messages in development
        if (process.env.NODE_ENV === 'development') {
            this.outputChannel.appendLine(this.formatMessage('DEBUG', message));
        }
    }
}

// DigitalOcean MCP Server Definition Provider
class DigitalOceanMcpProvider implements vscode.McpServerDefinitionProvider {
    private _onDidChangeMcpServerDefinitions = new vscode.EventEmitter<void>();
    readonly onDidChangeMcpServerDefinitions = this._onDidChangeMcpServerDefinitions.event;
    private logger: Logger;
    private lastTokenSetTime = 0;
    private readonly TOKEN_SET_COOLDOWN = 5000; // 5 seconds between token set attempts

    constructor(private context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
        this.logger = new Logger(outputChannel, 'Provider');
    }

    async provideMcpServerDefinitions(token: vscode.CancellationToken): Promise<vscode.McpStdioServerDefinition[]> {
        const apiToken = await this.context.secrets.get('tripox.digitaloceanMCP.apiToken');
        
        if (!apiToken) {
            return [];
        }

        // Security: Use hardcoded, trusted command and args to prevent code injection
        // Only the official DigitalOcean MCP package is allowed
        const command = 'npx';
        const args = ['@digitalocean/mcp'];
        
        // Security: Only pass essential environment variables to minimize attack surface
        const env: Record<string, string | number | null> = {
            DIGITALOCEAN_API_TOKEN: apiToken,
            // Prevent npm from sending analytics or update notifications
            npm_config_fund: 'false',
            npm_config_audit: 'false'
        };

        // Inherit PATH for npx to work, but ensure it's defined
        if (process.env.PATH) {
            env.PATH = process.env.PATH;
        }

        this.logger.info('Creating MCP server definition with secure, hardcoded command');

        const server = new vscode.McpStdioServerDefinition(
            'MCP Tools for DigitalOcean (Unofficial)',
            command,
            args,
            env
        );

        return [server];
    }

    async resolveMcpServerDefinition(
        server: vscode.McpStdioServerDefinition, 
        token: vscode.CancellationToken
    ): Promise<vscode.McpStdioServerDefinition | undefined> {
        // Validate API token before starting the server
        const apiToken = await this.context.secrets.get('tripox.digitaloceanMCP.apiToken');
        
        if (!apiToken) {
            const message = 'DigitalOcean API token is required. Please configure it using the "Set API Token" command.';
            this.logger.error('MCP server resolution failed: API token not configured');
            vscode.window.showErrorMessage(message);
            return undefined;
        }

        this.logger.info('MCP server definition resolved successfully');
        return server;
    }

    refresh() {
        this._onDidChangeMcpServerDefinitions.fire();
    }

    async setApiToken(): Promise<void> {
        // Rate limiting to prevent rapid token setting attempts
        const now = Date.now();
        if (now - this.lastTokenSetTime < this.TOKEN_SET_COOLDOWN) {
            const waitTime = Math.ceil((this.TOKEN_SET_COOLDOWN - (now - this.lastTokenSetTime)) / 1000);
            vscode.window.showWarningMessage(`Please wait ${waitTime} seconds before setting token again.`);
            return;
        }

        try {
            const token = await vscode.window.showInputBox({
                prompt: 'Enter your DigitalOcean API token',
                password: true,
                placeHolder: 'dop_v1_...',
                validateInput: (value) => {
                    if (!value || value.trim().length === 0) {
                        return 'API token cannot be empty';
                    }
                    // More strict validation for DigitalOcean API tokens
                    if (!value.startsWith('dop_v1_')) {
                        return 'DigitalOcean API token must start with "dop_v1_"';
                    }
                    // Check minimum length (DigitalOcean tokens are typically 64+ chars)
                    if (value.length < 20) {
                        return 'API token appears to be too short';
                    }
                    // Check for suspicious characters that shouldn't be in a token
                    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                        return 'API token contains invalid characters';
                    }
                    return null;
                }
            });

            if (token) {
                this.lastTokenSetTime = Date.now();
                // Additional server-side validation could be added here
                // by making a test API call to verify the token
                await this.context.secrets.store('tripox.digitaloceanMCP.apiToken', token);
                const message = 'DigitalOcean API token has been securely stored.';
                this.logger.info('API token stored successfully in secure storage');
                vscode.window.showInformationMessage(message);
                this.refresh();
            } else {
                this.logger.info('API token setup cancelled by user');
            }
        } catch (error) {
            this.logger.error(`Failed to set API token: ${error}`);
            vscode.window.showErrorMessage('Failed to store API token. Please try again.');
        }
    }

    async clearApiToken(): Promise<void> {
        await this.context.secrets.delete('tripox.digitaloceanMCP.apiToken');
        const message = 'DigitalOcean API token has been removed.';
        this.logger.info('API token cleared from secure storage');
        vscode.window.showInformationMessage(message);
        this.refresh();
    }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    // Create output channel for logging
    const outputChannel = vscode.window.createOutputChannel('MCP Tools for DigitalOcean (Unofficial)');
    const logger = new Logger(outputChannel, 'Activation');
    
    // Developer log for debugging
    logger.debug('Extension activation started');
    
    // User-facing log in output channel
    logger.info('Extension activated successfully');

    // Create and register the MCP server definition provider
    const mcpProvider = new DigitalOceanMcpProvider(context, outputChannel);
    const mcpDisposable = vscode.lm.registerMcpServerDefinitionProvider(
        'tripox.digitaloceanMCP.servers',
        mcpProvider
    );
    logger.info('MCP server definition provider registered');

    // Register commands
    const setApiTokenCommand = vscode.commands.registerCommand('tripox.digitaloceanMCP.setApiToken', async () => {
        await mcpProvider.setApiToken();
    });

    const clearApiTokenCommand = vscode.commands.registerCommand('tripox.digitaloceanMCP.clearApiToken', async () => {
        await mcpProvider.clearApiToken();
        outputChannel.appendLine('[INFO] API token cleared successfully');
    });

    const connectCommand = vscode.commands.registerCommand('tripox.digitaloceanMCP.connectServer', async () => {
        const apiToken = await context.secrets.get('tripox.digitaloceanMCP.apiToken');
        
        if (!apiToken) {
            const message = 'DigitalOcean API token is not configured. Would you like to configure it now?';
            logger.warn('Connection attempt failed: API token not configured');
            const response = await vscode.window.showWarningMessage(
                message,
                'Set Token',
                'Cancel'
            );
            
            if (response === 'Set Token') {
                await mcpProvider.setApiToken();
            }
            return;
        }

        mcpProvider.refresh();
        logger.info('MCP server connection request processed');
        vscode.window.showInformationMessage('Connected to DigitalOcean MCP server.');
    });

    const disconnectCommand = vscode.commands.registerCommand('tripox.digitaloceanMCP.disconnectServer', () => {
        logger.info('MCP server disconnection request processed');
        vscode.window.showInformationMessage('Disconnected from DigitalOcean MCP server.');
    });

    const refreshCommand = vscode.commands.registerCommand('tripox.digitaloceanMCP.refreshServers', () => {
        mcpProvider.refresh();
        logger.info('MCP server definitions refreshed');
        vscode.window.showInformationMessage('MCP servers refreshed.');
    });

    // Add all disposables to context subscriptions
    context.subscriptions.push(
        outputChannel,
        mcpDisposable,
        setApiTokenCommand,
        clearApiTokenCommand,
        connectCommand,
        disconnectCommand,
        refreshCommand
    );

    // Auto-connect if token exists and auto-connect is enabled
    const config = vscode.workspace.getConfiguration('tripox.digitaloceanMCP');
    if (config.get<boolean>('autoConnect', true)) {
        const apiToken = await context.secrets.get('tripox.digitaloceanMCP.apiToken');
        if (apiToken) {
            logger.info('Auto-connect enabled: attempting connection to MCP server');
            vscode.commands.executeCommand('tripox.digitaloceanMCP.connectServer');
        } else {
            logger.info('Auto-connect enabled but no API token found');
        }
    } else {
        logger.info('Auto-connect disabled in configuration');
    }

    // Listen for configuration changes
    const configChangeDisposable = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('tripox.digitaloceanMCP')) {
            logger.info('Configuration changed: refreshing MCP provider');
            mcpProvider.refresh();
        }
    });

    context.subscriptions.push(configChangeDisposable);
    
    logger.info('Extension activation completed successfully');
}

// This method is called when your extension is deactivated
export function deactivate() {
    console.log('[MCP Tools for DigitalOcean (Unofficial)] Extension deactivated');
}
