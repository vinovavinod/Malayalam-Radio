import express from 'express';
import http from 'http';
import https from 'https';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Stream proxy route to handle HTTP streams and CORS-restricted Icecast/Shoutcast streams safely over HTTPS
  app.get('/api/stream-proxy', (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).send('Missing url parameter');
    }

    try {
      const parsed = new URL(targetUrl);
      const client = parsed.protocol === 'https:' ? https : http;

      const request = client.get(
        targetUrl,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Icy-MetaData': '1'
          },
          timeout: 12000
        },
        (proxyRes) => {
          // Handle HTTP redirects (301, 302, 307, 308)
          if (proxyRes.statusCode && proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
            const redirectUrl = proxyRes.headers.location.startsWith('http')
              ? proxyRes.headers.location
              : new URL(proxyRes.headers.location, targetUrl).toString();
            return res.redirect(`/api/stream-proxy?url=${encodeURIComponent(redirectUrl)}`);
          }

          const contentType = proxyRes.headers['content-type'] || 'audio/mpeg';

          res.writeHead(proxyRes.statusCode || 200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Connection': 'keep-alive',
            'X-Content-Type-Options': 'nosniff'
          });

          proxyRes.pipe(res);

          req.on('close', () => {
            proxyRes.destroy();
            request.destroy();
          });
        }
      );

      request.on('error', (err) => {
        if (!res.headersSent) {
          res.status(502).send(`Error connecting to radio stream: ${err.message}`);
        }
      });

      request.setTimeout(12000, () => {
        request.destroy();
        if (!res.headersSent) {
          res.status(504).send('Stream connection timed out');
        }
      });

      req.on('close', () => {
        request.destroy();
      });
    } catch (err) {
      if (!res.headersSent) {
        res.status(400).send('Invalid stream URL');
      }
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Radio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
