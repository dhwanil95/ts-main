import 'reflect-metadata'
import { UrlLoaderService } from './services/url-loader.service.js'
import { Command } from 'commander'

interface AppParameters {
  url: string
  depthLevel: number
  word: string
}

export const DEFAULT_URL = 'https://www.kayako.com/'
export const DEFAULT_DEPTHLEVEL = 2
export const DEFAULT_WORD = 'kayako'

export class App {
  /* istanbul ignore next */
  constructor (private readonly urlLoader: UrlLoaderService, private readonly command = new Command()) {}

  async run (): Promise<void> {
    const appParameters = this.parseCli()
    await this.process(appParameters)
  }

  async process (appParameters: AppParameters): Promise<void> {
    const cnt = await this.countWordBFS(appParameters.url, appParameters.word, appParameters.depthLevel)
    console.log(`Found ${cnt} instances of '${appParameters.word}' in the body of the page`)
  }

  parseCli (argv: readonly string[] = process.argv): AppParameters {
    this.command
      .requiredOption('-u, --url <url>', 'URL to load', DEFAULT_URL)
      .option('-d, --depth <number>', 'Depth Level', value => parseInt(value, 10), DEFAULT_DEPTHLEVEL)
      .option('-w, --word <word>', 'Word to count', DEFAULT_WORD)

    this.command.parse(argv)
    const options = this.command.opts()

    return { url: options.url, depthLevel: options.depth, word: options.word }
  }

  async countWordBFS (url: string, word: string, maxDepth: number): Promise<number> {
    const counted = new Set<string>()
    const temp: Array<{ url: string, depthLevel: number }> = [{ url, depthLevel: 0 }]
    let ans = 0

    for (let i = 0; i < temp.length; i++) {
      const { url: currentUrl, depthLevel } = temp[i]
      if (counted.has(currentUrl) || depthLevel > maxDepth) {
        continue
      }
      counted.add(currentUrl)

      const { text, links } = await this.urlLoader.loadUrlTextAndLinks(currentUrl)
      ans += (text.toLocaleLowerCase().match(new RegExp(word, 'ig')) ?? []).length

      for (const l of links) {
        const t = l.split('#')[0]
        if (!counted.has(t)) {
          temp.push({ url: t, depthLevel: depthLevel + 1 })
        }
      }
    }
    return ans
  }
}
