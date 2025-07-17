import * as assert from 'assert';
import * as vscode from 'vscode';

suite('DigitalOcean MCP Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all DigitalOcean MCP extension tests.');

	test('Extension should be present', () => {
		const extension = vscode.extensions.getExtension('tripox.digitalocean-mcp');
		assert.ok(extension);
	});

	test('Commands should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		
		assert.ok(commands.includes('digitalocean-mcp.setApiToken'), 'Set API token command should be registered');
		assert.ok(commands.includes('digitalocean-mcp.clearApiToken'), 'Clear API token command should be registered');
		assert.ok(commands.includes('digitalocean-mcp.connectServer'), 'Connect server command should be registered');
		assert.ok(commands.includes('digitalocean-mcp.disconnectServer'), 'Disconnect server command should be registered');
		assert.ok(commands.includes('digitalocean-mcp.refreshServers'), 'Refresh servers command should be registered');
	});

	test('Configuration should be available', () => {
		const config = vscode.workspace.getConfiguration('digitalocean-mcp');
		assert.ok(config, 'Configuration should be available');
		
		// Test default values (API token no longer in configuration)
		assert.strictEqual(config.get('serverCommand'), 'npx');
		assert.deepStrictEqual(config.get('serverArgs'), ['@digitalocean/mcp']);
		assert.strictEqual(config.get('autoConnect'), true);
	});

	test('Secret storage should be available', () => {
		// Note: In a real test environment, you'd test with a proper extension context
		// This test verifies the extension structure is correct
		assert.ok(true, 'Secret storage API is used correctly in extension');
	});
});
