import { IFacebookAuthentication } from '@/domain/features'

class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: ILoadFacebookUserApi
  ) {}

  async perform (params: IFacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserApi.loadUser(params)
  }
}

interface ILoadFacebookUserApi {
  loadUser: (params: ILoadFacebookUserApi.Params) => Promise<void>
}

namespace ILoadFacebookUserApi {
  export type Params = {
    token: string
  }
}

class ILoadFacebookUserApiSpy implements ILoadFacebookUserApi {
  token?: string

  async loadUser (params: ILoadFacebookUserApi.Params): Promise<void> {
    this.token = params.token
  }
}

describe('FacebookAuthenticationService', () => {
  it('Should call ILoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new ILoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApi.token).toBe('any_token')
  })
})
