import { UrlLoaderService } from './services/url-loader.service.js';
import { App } from './app.js';

(async () => {
  const urlLoaderService = UrlLoaderService.getInstance();
  const app = new App(urlLoaderService);
  await app.run();
})();
