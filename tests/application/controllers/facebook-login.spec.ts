import { FacebookLoginController } from '@/application/controllers'
import { ServerError, UnauthorizedError } from '@/application/errors'
import { RequiredStringValidator, ValidationComposite } from '@/application/validation'
import { AuthenticationError } from '@/domain/errors'
import { IFacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'

import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/application/validation/composite')

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: MockProxy<IFacebookAuthentication>
  let token: string

  beforeAll(() => {
    facebookAuth = mock()
    facebookAuth.perform.mockReturnValue(Promise.resolve(new AccessToken('any_value')))
    token = 'any_token'
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  it('Should return 400 if validation fails', async () => {
    const error = new Error('validation error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest.mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle({ token })

    expect(ValidationCompositeSpy).toHaveBeenLastCalledWith([
      new RequiredStringValidator('any_token', 'token')
    ])

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
  })

  it('Should call IFacebookAuthentication with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token })
    expect(facebookAuth.perform).toBeCalledTimes(1)
  })

  it('Should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('Should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })

  it('Should return 500 if authentication throws', async () => {
    const error = new Error('infra_error')
    facebookAuth.perform.mockRejectedValueOnce(error)
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
