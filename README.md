# ATXP Minimal Demo

A minimal demonstration of ATXP to charge per-use of MCP tools.

## Overview

This project implements a simple MCP server that provides a basic "add" tool requiring payment before execution. It demonstrates how to integrate ATXP payment processing with MCP tools using the `@longrun/paymcp-client` library.

## Features

- **MCP Server**: Implements a Model Context Protocol server with HTTP transport
- **Payment Integration**: Uses ATXP for payment processing before tool execution
- **Simple Tool**: Provides an "add" tool that adds two numbers (requires $0.01 payment)
- **TypeScript**: Built with TypeScript for type safety
- **Express Server**: HTTP server with proper error handling

## Prerequisites

- Node.js (v18 or higher)
- npm 

## Installation

1. Clone the repository:
```bash
git clone git@github.com:novellum-ai/atxp-minimal-demo
cd atxp-minimal-demo
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Build the project:
```bash
npm run build
```

2. Start the server:
```bash
npm run start
```

The server will start on port 3000 (or the port specified in the `PORT` environment variable).

### Connecting From An MCP Client

In order to connect to this MCP server running locally using a client like Goose, you'll need to

**1. Start the server:**
```bash
npm run start
```

**2. Set up an ngrok tunnel:**
```bash
ngrok http http://127.0.0.1:3000
```

**3. Configure your MCP client:**
Add the host exposed by ngrok as the endpoint in Goose and then activate the extension.

### API Endpoints

#### POST /mcp
Main endpoint for MCP requests. Accepts JSON-RPC 2.0 requests.

**Example Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "add",
    "arguments": {
      "a": 5,
      "b": 3
    }
  }
}
```

#### GET /mcp
Returns a 405 Method Not Allowed error.

#### DELETE /mcp
Returns a 405 Method Not Allowed error.

### Available Tools

#### add
Adds two numbers together. Requires a $0.01 payment before execution.

**Parameters:**
- `a` (number): The first number to add
- `b` (number): The second number to add

**Returns:**
- The sum of the two numbers as text content

## Configuration

The server uses the following configuration:

- **Payment Destination**: `HQeMf9hmaus7gJhfBtPrPwPPsDLGfeVf8Aeri3uPP3Fy`
- **Payee Name**: `Add`
- **Payment Amount**: $0.01 per tool call
- **Default Port**: 3000 (configurable via `PORT` environment variable)

## Project Structure

```
atxp-minimal-demo/
├── src/
│   └── server.ts          # Main server implementation
├── build/                 # Compiled JavaScript output
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

## Dependencies

### Production Dependencies
- `@longrun/paymcp-client`: ATXP payment integration
- `@modelcontextprotocol/sdk`: MCP server implementation
- `express`: HTTP server framework
- `zod`: Schema validation
- `bignumber.js`: Precise number handling

### Development Dependencies
- `typescript`: TypeScript compiler
- `@types/express`: Express type definitions
- `@types/node`: Node.js type definitions

## Development

### Building
```bash
npm run build
```

### Development Server
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

## License

MIT

## Contributing

This is a minimal demo project. For production use, consider adding:

- Error handling and logging
- Input validation
- Security measures
- Unit tests
- Documentation
- Environment configuration
