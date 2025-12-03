import { Router } from 'express';
import { sseFacade } from '../facade';
import * as path from 'path';
import * as express from 'express';

const router: Router = Router();

// Servir archivos estáticos de /src/api (index.html, app.js, etc.)
router.use(express.static(path.join(__dirname)));

router.get('/subscribe/:id/:channel?', sseFacade.event);
router.post('/send', sseFacade.send);

router.get('/', (req, res) => {
  // Evitar caché del index para que no se sirva la versión antigua con inline script
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, '/index.html'));
});

router.options('/subscribe/:id/:channel?', sseFacade.options);
router.get('/ping', async (req, res) => {
  res.send('pong');
});

export default router;
