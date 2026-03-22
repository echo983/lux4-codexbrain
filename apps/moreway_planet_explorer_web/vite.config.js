import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

const repoRoot = path.resolve(__dirname, '..', '..');
const datasetRoot = path.join(repoRoot, 'var', 'moreway_planet_dataset');

function serveLocalDataset() {
  return {
    name: 'serve-moreway-planet-dataset',
    configureServer(server) {
      server.middlewares.use('/var/moreway_planet_dataset', (req, res, next) => {
        const requestPath = (req.url || '/').split('?')[0];
        const relativePath = requestPath.replace(/^\/+/, '');
        const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
        const target = path.join(datasetRoot, normalized);
        if (!target.startsWith(datasetRoot)) {
          res.statusCode = 403;
          res.end('Forbidden');
          return;
        }
        if (!fs.existsSync(target) || fs.statSync(target).isDirectory()) {
          next();
          return;
        }
        if (target.endsWith('.json')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        } else if (target.endsWith('.arrow')) {
          res.setHeader('Content-Type', 'application/vnd.apache.arrow.file');
        }
        fs.createReadStream(target).pipe(res);
      });
    },
  };
}

export default defineConfig({
  plugins: [serveLocalDataset()],
  server: {
    host: '0.0.0.0',
    port: 18571,
  },
});
