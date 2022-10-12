import { ILoadFacebookUserApi } from '@/data/contracts/apis'
import { IHttpGetClient } from '@/infra/http'

export class FacebookApi {
  private readonly baseUrl: string = 'https://graph.facebook.com'

  constructor (
    private readonly httpClient: IHttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: ILoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }
}
