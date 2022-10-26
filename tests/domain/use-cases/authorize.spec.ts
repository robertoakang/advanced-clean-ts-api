
import { mock, MockProxy } from 'jest-mock-extended'

export interface ITokenValidator {
  validateToken: (params: ITokenValidator.Params) => Promise<void>
}

export namespace ITokenValidator {
  export type Params = { token: string }
}

type Setup = (crypto: ITokenValidator) => Authorize
type Input = { token: string }
type Authorize = (params: Input) => Promise<void>

const setupAuthorize: Setup = crypto => async params => {
  await crypto.validateToken(params)
}

describe('Authorize', () => {
  let crypto: MockProxy<ITokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  it('Should call ITokenValidator with correct params', async () => {
    await sut({ token })

    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })
})
