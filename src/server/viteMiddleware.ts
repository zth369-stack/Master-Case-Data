import type { Plugin } from 'vite';
import { handleApiRequest } from './apiHandler.js';
import { handleMcpHttpRequest } from './mcpServer.js';

export function mygdxMiddlewarePlugin(): Plugin {
  return {
    name: 'mygdx-ssm-middleware-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // Handle MCP Server routes: /mcp, /mcp/sse, /mcp/courtlistener, etc.
        if (url.startsWith('/mcp')) {
          try {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', async () => {
              const mcpHandled = await handleMcpHttpRequest(req, res, body);
              if (!mcpHandled) {
                next();
              }
            });
            return;
          } catch (err) {
            console.error('[SSM MCP] Server Error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32603, message: 'Internal MCP error' } }));
            return;
          }
        }

        // Handle API routes: /api/*
        if (url.startsWith('/api/')) {
          try {
            const handled = await handleApiRequest(req, res);
            if (handled) return;
          } catch (err) {
            console.error('[SSM Middleware] API Error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
            return;
          }
        }

        next();
      });
    },
  };
}
