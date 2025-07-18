// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// DigitalOcean MCP Server Definition Provider
class DigitalOceanMcpProvider implements vscode.McpServerDefinitionProvider {
    private _onDidChangeMcpServerDefinitions = new vscode.EventEmitter<void>();
    readonly onDidChangeMcpServerDefinitions = this._onDidChangeMcpServerDefinitions.event;

    constructor(private context: vscode.ExtensionContext) {}

    async provideMcpServerDefinitions(token: vscode.CancellationToken): Promise<vscode.McpStdioServerDefinition[]> {
        const apiToken = await this.context.secrets.get('tripox.digitaloceanMCP.apiToken');
        
        if (!apiToken) {
            return [];
        }

        const config = vscode.workspace.getConfiguration('tripox.digitaloceanMCP');
        const command = config.get<string>('serverCommand', 'npx');
        const args = config.get<string[]>('serverArgs', ['@digitalocean/mcp']);
        const env = {
            DIGITALOCEAN_API_TOKEN: apiToken
        };

        const server = new vscode.McpStdioServerDefinition(
            'DigitalOcean MCP Server',
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
            vscode.window.showErrorMessage('DigitalOcean API token is required. Please configure it using the "Set API Token" command.');
            return undefined;
        }

        return server;
    }

    refresh() {
        this._onDidChangeMcpServerDefinitions.fire();
    }

    async setApiToken(): Promise<void> {
        const token = await vscode.window.showInputBox({
            prompt: 'Enter your DigitalOcean API token',
            password: true,
            placeHolder: 'dop_v1_...',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'API token cannot be empty';
                }
                if (!value.startsWith('dop_v1_')) {
                    return 'DigitalOcean API token should start with "dop_v1_"';
                }
                return null;
            }
        });

        if (token) {
            await this.context.secrets.store('tripox.digitaloceanMCP.apiToken', token);
            vscode.window.showInformationMessage('DigitalOcean API token has been securely stored.');
            this.refresh();
        }
    }

    async clearApiToken(): Promise<void> {
        await this.context.secrets.delete('tripox.digitaloceanMCP.apiToken');
        vscode.window.showInformationMessage('DigitalOcean API token has been removed.');
        this.refresh();
    }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    console.log('DigitalOcean MCP extension is now active!');

    // Create and register the MCP server definition provider
    const mcpProvider = new DigitalOceanMcpProvider(context);
    const mcpDisposable = vscode.lm.registerMcpServerDefinitionProvider(
        'tripox.digitaloceanMCP.servers',
        mcpProvider
    );

    // Register commands
    const setApiTokenCommand = vscode.commands.registerCommand('tripox.digitaloceanMCP.setApiToken', async () => {
        await mcpProvider.setApiToken();
    });

    const clearApiTokenCommand = vscode.commands.registerCommand('tripox.digitaloceanMCP.clearApiToken', async () => {
        await mcpProvider.clearApiToken();
        vscode.window.showInformationMessage('DigitalOcean API token cleared successfully.');
    });

    const connectCommand = vscode.commands.registerCommand('tripox.digitaloceanMCP.connectServer', async () => {
        const apiToken = await context.secrets.get('tripox.digitaloceanMCP.apiToken');
        
        if (!apiToken) {
            const response = await vscode.window.showWarningMessage(
                'DigitalOcean API token is not configured. Would you like to configure it now?',
                'Set Token',
                'Cancel'
            );
            
            if (response === 'Set Token') {
                await mcpProvider.setApiToken();
            }
            return;
        }

        mcpProvider.refresh();
        vscode.window.showInformationMessage('DigitalOcean MCP server connection initiated.');
    });

    const disconnectCommand = vscode.commands.registerCommand('tripox.digitaloceanMCP.disconnectServer', () => {
        vscode.window.showInformationMessage('MCP server disconnection initiated.');
    });

    const refreshCommand = vscode.commands.registerCommand('tripox.digitaloceanMCP.refreshServers', () => {
        mcpProvider.refresh();
        vscode.window.showInformationMessage('MCP servers refreshed.');
    });

    // Add all disposables to context subscriptions
    context.subscriptions.push(
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
            vscode.commands.executeCommand('tripox.digitaloceanMCP.connectServer');
        }
    }

    // Listen for configuration changes
    const configChangeDisposable = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('tripox.digitaloceanMCP')) {
            mcpProvider.refresh();
        }
    });

    context.subscriptions.push(configChangeDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
    console.log('DigitalOcean MCP extension is now deactivated.');
}
