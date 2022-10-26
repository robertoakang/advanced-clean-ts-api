
import { mock, MockProxy } from 'jest-mock-extended'

export interface ITokenValidator {
  validateToken: (params: ITokenValidator.Params) => Promise<ITokenValidator.Result>
}

export namespace ITokenValidator {
  export type Params = { token: string }
  export type Result = string
}

type Setup = (crypto: ITokenValidator) => Authorize
type Input = { token: string }
type Output = string
type Authorize = (params: Input) => Promise<Output>

const setupAuthorize: Setup = crypto => async params => {
  return await crypto.validateToken(params)
}

describe('Authorize', () => {
  let crypto: MockProxy<ITokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
    crypto.validateToken.mockResolvedValue('any_value')
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  it('Should call ITokenValidator with correct params', async () => {
    await sut({ token })

    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })

  it('Should return the correct accessToken', async () => {
    const userId = await sut({ token })

    expect(userId).toBe('any_value')
  })
})
