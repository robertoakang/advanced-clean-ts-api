import { AuthenticationError } from '@/domain/errors'
import { IFacebookAuthentication } from '@/domain/features'

class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: ILoadFacebookUserApi
  ) {}

  async perform (params: IFacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserApi.loadUser(params)
    return new AuthenticationError()
  }
}

interface ILoadFacebookUserApi {
  loadUser: (params: ILoadFacebookUserApi.Params) => Promise<ILoadFacebookUserApi.Result>
}

namespace ILoadFacebookUserApi {
  export type Params = {
    token: string
  }

  export type Result = undefined
}

class ILoadFacebookUserApiSpy implements ILoadFacebookUserApi {
  token?: string
  result = undefined

  async loadUser (params: ILoadFacebookUserApi.Params): Promise<ILoadFacebookUserApi.Result> {
    this.token = params.token
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
  it('Should call ILoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new ILoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApi.token).toBe('any_token')
  })

  it('Should return AuthenticationError when ILoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = new ILoadFacebookUserApiSpy()
    loadFacebookUserApi.result = undefined
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
