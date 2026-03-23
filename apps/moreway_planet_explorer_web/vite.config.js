import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

const repoRoot = path.resolve(__dirname, '..', '..');
const datasetRoot = path.join(repoRoot, 'var', 'moreway_planet_dataset');
const assetCardRoot = path.join(repoRoot, 'var', 'google_keep_asset_cards_directmd_eval200');
const openaiImageRoot = path.join(repoRoot, 'var', 'openai_image_experiments');
const planetMaterialAssetRoot = path.join(repoRoot, 'var', 'planet_material_assets');

function serveStaticDir(mountPath, rootPath) {
  return {
    name: `serve-static-${mountPath.replaceAll('/', '-')}`,
    configureServer(server) {
      server.middlewares.use(mountPath, (req, res, next) => {
        const requestPath = (req.url || '/').split('?')[0];
        const relativePath = requestPath.replace(/^\/+/, '');
        const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
        const target = path.join(rootPath, normalized);
        if (!target.startsWith(rootPath)) {
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
        } else if (target.endsWith('.md')) {
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        } else if (target.endsWith('.png')) {
          res.setHeader('Content-Type', 'image/png');
        } else if (target.endsWith('.jpg') || target.endsWith('.jpeg')) {
          res.setHeader('Content-Type', 'image/jpeg');
        } else if (target.endsWith('.webp')) {
          res.setHeader('Content-Type', 'image/webp');
        }
        fs.createReadStream(target).pipe(res);
      });
    },
  };
}

export default defineConfig({
  plugins: [
    serveStaticDir('/var/moreway_planet_dataset', datasetRoot),
    serveStaticDir('/var/google_keep_asset_cards_directmd_eval200', assetCardRoot),
    serveStaticDir('/var/openai_image_experiments', openaiImageRoot),
    serveStaticDir('/var/planet_material_assets', planetMaterialAssetRoot),
  ],
  server: {
    host: '0.0.0.0',
    port: 18571,
  },
});
