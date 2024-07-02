import puppeteer, { Page } from 'puppeteer';

export class PageEvalService {
  async evalPage(page: Page): Promise<Awaited<string>> {
    return await page.evaluate(() => document.body.innerText);
  }
}

export async function pageEval<T>(page: Page, pageFunction: () => T): Promise<Awaited<T>> {
  return await page.evaluate(pageFunction);
}

// istanbul ignore next - this function is running in dom context of headless browser
export function domExtractText(): string {
  return document?.body?.innerText ?? '';
}

// istanbul ignore next - this function is running in dom context of headless browser
export function domExtractHyperlinks(): string[] {
  return Array.from(document.getElementsByTagName('a'), a => a.href);
}
