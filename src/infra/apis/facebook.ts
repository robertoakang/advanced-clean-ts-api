import { ILoadFacebookUserApi } from '@/data/contracts/apis'
import { IHttpGetClient } from '@/infra/http'

export class FacebookApi implements ILoadFacebookUserApi {
  private readonly baseUrl: string = 'https://graph.facebook.com'

  constructor (
    private readonly httpClient: IHttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: ILoadFacebookUserApi.Params): Promise<ILoadFacebookUserApi.Result> {
    const appToken = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })

    const debugToken = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: params.token
      }
    })

    const userInfo = await this.httpClient.get({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: params.token
      }
    })

    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email
    }
  }
}
