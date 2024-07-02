import puppeteer, { Page } from 'puppeteer';

export class UrlLoaderService {
  private static instance: UrlLoaderService;

  private constructor() {} // Make the constructor private to prevent direct instantiation

  public static getInstance(): UrlLoaderService {
    if (!UrlLoaderService.instance) {
      UrlLoaderService.instance = new UrlLoaderService();
    }
    return UrlLoaderService.instance;
  }

  async loadUrlTextAndLinks(url: string, retries = 3): Promise<{ text: string, links: string[] }> {
    const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage'] });
    const page = await browser.newPage();

    try {
      console.log(`Navigating to URL: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); // Increase timeout to 60 seconds

      console.log('Waiting for body selector...');
      await page.waitForSelector('body', { timeout: 60000 }); // Increase timeout to 60 seconds

      const text = await page.evaluate(() => document.body.innerText);
      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href]'), a => (a as HTMLAnchorElement).href)
      );

      // Debug logging to verify the links before filtering
      console.log('All extracted links:', links);

      // Ensure that we're only keeping valid URLs
      const filteredLinks = links.filter(href => {
        try {
          const url = new URL(href);
          return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (e) {
          return false;
        }
      });

      // Debug logging to verify the filtered links
      console.log('Filtered links:', filteredLinks);

      await browser.close();
      return { text, links: filteredLinks };

    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying... (${3 - retries} attempts left)`);
        return this.loadUrlTextAndLinks(url, retries - 1);
      } else {
        console.error(`Error navigating to URL: ${url}`, error);
        await browser.close();
        return { text: '', links: [] }; // Return empty values in case of an error
      }
    }
  }
}
