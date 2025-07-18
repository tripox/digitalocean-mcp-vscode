# Changelog

All notable changes to the "DigitalOcean MCP VS Code Extension (Unofficial)" are documented in this changelog.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-18

### Changed
- **BREAKING**: Updated extension name from "DigitalOcean MCP" to "DigitalOcean MCP (Unofficial)" to avoid confusion with potential official DigitalOcean extensions
- **BREAKING**: Changed package name from `digitalocean-mcp` to `tripox-digitalocean-mcp` for better namespace safety
- **BREAKING**: Changed all command IDs from `digitalocean-mcp.*` to `tripox.digitaloceanMCP.*` to prevent conflicts with potential official extensions
- **BREAKING**: Updated configuration namespace from `digitalocean-mcp` to `tripox.digitaloceanMCP`
- **BREAKING**: Changed secret storage keys from `digitalocean-mcp.*` to `tripox.digitaloceanMCP.*`
- Updated all command categories to include "(Unofficial)" designation
- Updated configuration title and MCP server labels to include "(Unofficial)" designation
- Added "unofficial" and "community" keywords to improve marketplace discoverability

### Migration Notes
- **User Action Required**: Users will need to reconfigure their API token as the secret storage key has changed
- All existing settings under `digitalocean-mcp.*` will need to be migrated to `tripox.digitaloceanMCP.*`
- Command palette commands now appear under "DigitalOcean MCP (Unofficial)" category

## [0.0.1] - 2025-07-18

### Added
- Initial release of DigitalOcean MCP VS Code Extension (Unofficial)
- Secure API token management using VS Code's SecretStorage API
- MCP server integration for DigitalOcean services
- Command palette integration with the following commands:
  - `DigitalOcean MCP (Unofficial): Set DigitalOcean API Token`
  - `DigitalOcean MCP (Unofficial): Clear DigitalOcean API Token`
  - `DigitalOcean MCP (Unofficial): Connect to DigitalOcean MCP Server`
  - `DigitalOcean MCP (Unofficial): Disconnect from MCP Server`
  - `DigitalOcean MCP (Unofficial): Refresh MCP Servers`
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

[1.0.0]: https://github.com/tripox/digitalocean-mcp-vscode/releases/tag/v1.0.0
[0.0.1]: https://github.com/tripox/digitalocean-mcp-vscode/releases/tag/v0.0.1
