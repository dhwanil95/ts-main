import { UrlLoaderService } from './services/url-loader.service.js'

describe('UrlLoaderService', () => {
  it('should be a singleton', () => {
    const instance1 = UrlLoaderService.getInstance()
    const instance2 = UrlLoaderService.getInstance()
    expect(instance1).toBe(instance2)
  })

  // Other tests
})
