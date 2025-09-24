/* eslint-disable no-console */
import express, { Request, Response } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { BigNumber } from 'bignumber.js';
import { requirePayment, ChainPaymentDestination } from '@atxp/server';
import { atxpExpress } from '@atxp/express';


const getServer = () => {
  const server = new McpServer({
    name: 'atxp-min-demo',
    version: '1.0.0',
  });

  server.tool(
    "add",
    "Use this tool to add two numbers together.",
    {
      a: z.number().describe("The first number to add"),
      b: z.number().describe("The second number to add"),
    },
    async ({ a, b }) => {
      // Require payment for the tool call
      await requirePayment({price: BigNumber(0.01)});
      return {
        content: [
          {
            type: "text",
            text: `${a + b}`,
          },
        ],
      };
    }
  );

  return server;
}

const app = express();
app.use(express.json());

const destination = new ChainPaymentDestination('HQeMf9hmaus7gJhfBtPrPwPPsDLGfeVf8Aeri3uPP3Fy', 'base');

app.use(atxpExpress({
  paymentDestination: destination,
  payeeName: 'ATXP Example Resource Server',
  allowHttp: true, // Only use in development
}));


app.post('/', async (req: Request, res: Response) => {
  const server = getServer();
  try {
    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    res.on('close', () => {
      console.log('Request closed');
      transport.close();
      server.close();
    });
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
});

app.get('/', async (req: Request, res: Response) => {
  console.log('Received GET MCP request');
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: null
  }));
});

app.delete('/', async (req: Request, res: Response) => {
  console.log('Received DELETE MCP request');
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: null
  }));
});


// Start the server
app.listen(3000, (error) => {
  if (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
  console.log(`ATXP Minimal Demo listening on port 3000`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  process.exit(0);
});
