# Changelog

All notable changes to the "DigitalOcean MCP VS Code Extension" will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2025-07-18

### Added
- Initial release of DigitalOcean MCP VS Code Extension
- Secure API token management using VS Code's SecretStorage API
- MCP server integration for DigitalOcean services
- Command palette integration with the following commands:
  - `DigitalOcean MCP: Set DigitalOcean API Token`
  - `DigitalOcean MCP: Clear DigitalOcean API Token`
  - `DigitalOcean MCP: Connect to DigitalOcean MCP Server`
  - `DigitalOcean MCP: Disconnect from MCP Server`
  - `DigitalOcean MCP: Refresh MCP Servers`
- Auto-connection capabilities with configurable settings
- Password-masked token input for enhanced security
- Comprehensive security audit and documentation
- MIT license and proper disclaimers

### Security
- No secrets stored in configuration files or written to disk
- Token input is masked in the UI
- No telemetry or data collection included
- All API tokens stored using VS Code's encrypted SecretStorage

### Configuration
- `digitalocean-mcp.serverCommand`: Command to run the MCP server (default: `npx`)
- `digitalocean-mcp.serverArgs`: Arguments for the MCP server command (default: `["@digitalocean/mcp"]`)
- `digitalocean-mcp.autoConnect`: Automatically connect to MCP server on startup (default: `true`)

[0.0.1]: https://github.com/tripox/digitalocean-mcp-vscode/releases/tag/v0.0.1
