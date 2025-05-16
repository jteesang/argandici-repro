import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

// 1) Fichiers statiques
app.use(express.static(browserDistFolder, { maxAge: '1y', index: 'index.html' }));

// 2) Toutes les autres requêtes passent par Universal
app.get('*', (req, res, next) => {
  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    })
    .then(html => res.send(html))
    .catch(err => next(err));
});

// 3) On écoute **toujours**, sans garde**
const port = process.env['PORT'] || 4000;
app.listen(port, () => {
  console.log(`🚀 Express + Angular SSR listening on http://localhost:${port}`);
});

export default app;
