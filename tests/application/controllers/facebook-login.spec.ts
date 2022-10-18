import { IFacebookAuthentication } from '@/domain/features'
import { mock } from 'jest-mock-extended'

class FacebookLoginController {
  constructor (private readonly facebookAuthentication: IFacebookAuthentication) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    await this.facebookAuthentication.perform({ token: httpRequest.token })
    return {
      statusCode: 400,
      data: new Error('The field token is required')
    }
  }
}

type HttpResponse = {
  statusCode: number
  data: any
}

describe('FacebookLoginController', () => {
  it('Should return 400 if token is empty', async () => {
    const facebookAuth = mock<IFacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)

    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('Should return 400 if token is null', async () => {
    const facebookAuth = mock<IFacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)

    const httpResponse = await sut.handle({ token: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('Should return 400 if token is undefined', async () => {
    const facebookAuth = mock<IFacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)

    const httpResponse = await sut.handle({ token: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('Should call IFacebookAuthentication with correct param', async () => {
    const facebookAuth = mock<IFacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)

    await sut.handle({ token: 'any_token' })

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.perform).toBeCalledTimes(1)
  })
})
