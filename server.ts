import express from 'express';
import path from 'node:path';
import { handleApiRequest } from './src/server/apiHandler.js';
import { handleMcpHttpRequest } from './src/server/mcpServer.js';

const app = express();
const PORT = 3000;

// MCP Server routes (Model Context Protocol JSON-RPC & SSE)
app.use('/mcp', async (req, res, next) => {
  try {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      const handled = await handleMcpHttpRequest(req, res, body);
      if (!handled) {
        next();
      }
    });
  } catch (err) {
    console.error('MCP Server Error:', err);
    res.status(500).json({ jsonrpc: '2.0', id: null, error: { code: -32603, message: 'Internal Server Error' } });
  }
});

// API routes handled by the SSM Middleware module
app.get('/ws/telemetry', (_req, res) => {
  res.json({
    status: 'healthy',
    echo: 'telemetry_online',
    active_nodes: 4,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', async (req, res, next) => {
  try {
    const handled = await handleApiRequest(req, res);
    if (!handled) {
      next();
    }
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Serve static frontend in production
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// Fallback for SPA routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SSM Middleware server running on http://0.0.0.0:${PORT}`);
});
