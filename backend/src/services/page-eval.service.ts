import { Page } from 'puppeteer'

export class PageEvalService {
  async evalPage (page: Page): Promise<string> {
    return await page.evaluate(() => document.body.innerText)
  }
}

export async function pageEval<T> (page: Page, pageFunction: () => T | Promise<T>): Promise<T> {
  return await page.evaluate(pageFunction) as T
}

// istanbul ignore next - this function is running in dom context of headless browser
export function domExtractText (): string {
  return document?.body?.innerText ?? ''
}

// istanbul ignore next - this function is running in dom context of headless browser
export function domExtractHyperlinks (): string[] {
  return Array.from(document.getElementsByTagName('a'), a => (a as HTMLAnchorElement).href)
}
