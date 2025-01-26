import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from 'http';
import type { Connect } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {},
    // Enable SPA fallback
    historyApiFallback: true,
    middleware: [
      // Handle POST requests to /payment/status
      async (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        if (req.method === 'POST' && req.url === '/payment/status') {
          // Collect the POST data
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            // Redirect to the same URL with data as query parameters
            res.writeHead(303, {
              'Location': `/payment/status?${body}`
            });
            res.end();
          });
        } else {
          next();
        }
      }
    ]
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/', // Ensure base URL is set correctly
}));
