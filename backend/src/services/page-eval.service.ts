import { Page } from 'puppeteer'

export class PageEvalService {
  async evalPage (page: Page): Promise<string> {
    return await page.evaluate(() => document.body.innerText)
  }
}

export async function pageEval<T> (page: Page, pageFunction: () => T | Promise<T>): Promise<Awaited<T>> {
  return await page.evaluate(pageFunction) as Awaited<T>
}

export function domExtractText (): string {
  return document?.body?.innerText ?? ''
}

export function domExtractHyperlinks (): string[] {
  return Array.from(document.getElementsByTagName('a')).map((a: HTMLAnchorElement) => a.href)
}
