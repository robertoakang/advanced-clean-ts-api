import { ILoadFacebookUserApi } from '@/data/contracts/apis'

import { mock, MockProxy } from 'jest-mock-extended'

class FacebookApi {
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

interface IHttpGetClient {
  get: (params: IHttpGetClient.Params) => Promise<void>
}
namespace IHttpGetClient {
  export type Params = {
    url: string
    params: object
  }
}

describe('FacebookApi', () => {
  let sut: FacebookApi
  let httpClient: MockProxy<IHttpGetClient>
  let clientId: string
  let clientSecret: string

  beforeAll(() => {
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret_id'
    httpClient = mock()
  })

  beforeEach(() => {
    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })

  it('Should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })
})
