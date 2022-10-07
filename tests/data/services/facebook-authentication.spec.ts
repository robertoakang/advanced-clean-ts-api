import { ILoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

class ILoadFacebookUserApiSpy implements ILoadFacebookUserApi {
  token?: string
  callsCount = 0
  result = undefined

  async loadUser (params: ILoadFacebookUserApi.Params): Promise<ILoadFacebookUserApi.Result> {
    this.token = params.token
    this.callsCount++
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
  it('Should call ILoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new ILoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApi.token).toBe('any_token')
    expect(loadFacebookUserApi.callsCount).toBe(1)
  })

  it('Should return AuthenticationError when ILoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = new ILoadFacebookUserApiSpy()
    loadFacebookUserApi.result = undefined
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
