import puppeteer from 'puppeteer'

export class UrlLoaderService {
  private static instance: UrlLoaderService

  // Constructor is intentionally empty to prevent direct instantiation
  private constructor () {
    // This is emoty
  }

  public static getInstance (): UrlLoaderService {
    if (UrlLoaderService.instance == null) {
      UrlLoaderService.instance = new UrlLoaderService()
    }
    return UrlLoaderService.instance
  }

  async loadUrlTextAndLinks (url: string, retries = 3): Promise<{ text: string, links: string[] }> {
    const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage'] })
    const page = await browser.newPage()

    try {
      console.log(`Navigating to URL: ${url}`)
      await page.goto(url)

      console.log('Waiting for body selector...')
      await page.waitForSelector('body', { timeout: 60000 })

      const text = await page.evaluate(() => document.body.innerText)
      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href]'), a => (a as HTMLAnchorElement).href)
      )

      // Debug logging to verify the links before filtering
      console.log('All extracted links:', links)

      // Ensure that we're only keeping valid URLs
      const filteredLinks = links.filter((href: string) => {
        try {
          const linkUrl = new URL(href)
          return linkUrl.protocol === 'http:' || linkUrl.protocol === 'https:'
        } catch (e) {
          return false
        }
      })

      // Debug logging to verify the filtered links
      console.log('Filtered links:', filteredLinks)

      await browser.close()
      return { text, links: filteredLinks }
    } catch (error) {
      await browser.close()
      if (retries > 0) {
        console.log(`Retrying... (${3 - retries} attempts left)`)
        return await this.loadUrlTextAndLinks(url, retries - 1)
      } else {
        console.error(`Error navigating to URL: ${url}`, error)
        return { text: '', links: [] }
      }
    }
  }
}
