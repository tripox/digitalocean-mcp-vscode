# MCP Tools for DigitalOcean (Unofficial)

[![CI](https://github.com/tripox/digitalocean-mcp-vscode/actions/workflows/ci.yml/badge.svg)](https://github.com/tripox/digitalocean-mcp-vscode/actions/workflows/ci.yml)
[![Release](https://github.com/tripox/digitalocean-mcp-vscode/actions/workflows/release.yml/badge.svg)](https://github.com/tripox/digitalocean-mcp-vscode/actions/workflows/release.yml)
[![VS Code Version](https://img.shields.io/badge/VS%20Code-1.102.0+-blue.svg)](https://code.visualstudio.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An **unofficial** VS Code extension that registers a DigitalOcean MCP server, allowing tools like Copilot Chat to interact with your infrastructure — including apps, deployments, logs, and metrics — directly from your editor.

> **⚠️ Disclaimer**: This is an unofficial community extension and is not affiliated with, endorsed by, or sponsored by DigitalOcean, LLC. DigitalOcean is a trademark of DigitalOcean, LLC.

## Features

- **MCP Server Integration**: Connect to DigitalOcean's MCP server to access cloud resources and services
- **Automatic Connection**: Configurable auto-connection to MCP server on startup
- **Secure Credential Management**: Secure storage of DigitalOcean API credentials using VS Code's SecretStorage API
- **Command Palette Integration**: Access all MCP functions through VS Code's command palette

## Requirements

- VS Code version 1.102.0 or higher
- DigitalOcean API token
- Node.js and npm (for running the MCP server)

## Installation

1. Install the extension from the VS Code marketplace
2. Set your DigitalOcean API token using the "MCP Tools for DigitalOcean (Unofficial): Set DigitalOcean API Token" command
3. The extension will automatically connect to the MCP server

## Migration from Previous Versions

**Breaking Changes in v1.0.0:**
- Extension package name changed from `digitalocean-mcp` to `digitalocean-mcp-tools`
- All command IDs now use `tripox.digitaloceanMCP.*` namespace
- Configuration keys updated to `tripox.digitaloceanMCP.*` format
- API tokens stored with new secret storage keys

**Migration Steps:**
1. Update to the new version
2. Reconfigure your settings (they will reset due to namespace changes)
3. Re-enter your DigitalOcean API token (previous token will not migrate)
4. Update any custom keybindings or automation that references the old command IDs

## Extension Commands

This extension contributes the following commands:

* `MCP Tools for DigitalOcean (Unofficial): Set DigitalOcean API Token`: Securely store your DigitalOcean API token
* `MCP Tools for DigitalOcean (Unofficial): Clear API Token for DigitalOcean MCP`: Remove stored API token from secure storage
* `MCP Tools for DigitalOcean (Unofficial): Connect to DigitalOcean MCP Server`: Manually connect to the MCP server
* `MCP Tools for DigitalOcean (Unofficial): Disconnect from DigitalOcean MCP Server`: Disconnect from the MCP server
* `MCP Tools for DigitalOcean (Unofficial): Refresh MCP Servers`: Refresh the list of available MCP servers

## Extension Settings

This extension contributes the following setting:

* `tripox.digitaloceanMCP.autoConnect`: Automatically connect to MCP server on startup (default: `true`)

**Security Note**: For security reasons, the MCP server command and arguments are hardcoded to use only the official `@digitalocean/mcp` package via `npx`. This prevents arbitrary code execution vulnerabilities.

## Setup

1. **Get a DigitalOcean API Token**:
   - Go to [DigitalOcean API Tokens](https://cloud.digitalocean.com/account/api/tokens)
   - Create a new Personal Access Token
   - Copy the token

2. **Configure the Extension**:
   - Open VS Code
   - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
   - Run the command "MCP Tools for DigitalOcean (Unofficial): Set DigitalOcean API Token"
   - Paste your API token when prompted

   The extension will automatically download and run the DigitalOcean MCP server using `npx @digitalocean/mcp` when needed.

## Security

This extension was developed with security best practices:

### Data Protection
- API tokens are stored using VS Code's encrypted SecretStorage
- No secrets are stored in settings or written to disk
- Token input is masked in the UI
- No telemetry or data collection is included

### Code Execution Security
- **Hardcoded command execution**: Only `npx @digitalocean/mcp` can be executed
- **No user-configurable commands**: Prevents arbitrary code execution vulnerabilities
- **Limited environment exposure**: Only essential environment variables are passed to subprocesses
- **Input validation**: Strict validation of API token format and content

## Known Issues

No known issues at this time. Please report any bugs or feature requests via [GitHub Issues](https://github.com/tripox/digitalocean-mcp-vscode/issues).

## Releases

See [CHANGELOG.md](./CHANGELOG.md) or the [GitHub Releases](https://github.com/tripox/digitalocean-mcp-vscode/releases) page for version history.

## Development

### Prerequisites
- Node.js (≥ 18.x)
- VS Code (≥ 1.102.0)
- Git

### Setup
```bash
git clone https://github.com/tripox/digitalocean-mcp-vscode.git
cd digitalocean-mcp-vscode
npm install
```

### Building
```bash
npm run compile        # Build the extension
npm run watch         # Watch mode for development
npm run package       # Package for production
npm run build         # Build extension and create VSIX package
```

### Testing
```bash
npm test              # Run all tests
npm run lint          # Run linting
npm run check-types   # Type checking
```

### Debugging
1. Open the project in VS Code
2. Press `F5` to launch the Extension Development Host
3. Test your changes in the new VS Code window

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Disclaimer

This extension is an independent project and is **not affiliated with or endorsed by DigitalOcean**.

Use at your own risk. The author assumes **no responsibility for loss of data, account issues, infrastructure misconfigurations, or any other damages** resulting from the use of this extension.

Always review source code and understand what the extension does before using it in production environments.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [DigitalOcean](https://www.digitalocean.com/) for providing the MCP server
- [DigitalOcean MCP Server](https://github.com/digitalocean/digitalocean-mcp) - The official DigitalOcean Model Context Protocol implementation
- [Model Context Protocol](https://modelcontextprotocol.io/) for the protocol specification
- VS Code team for the excellent extension API

---

**Enjoy using DigitalOcean MCP Extension!**
