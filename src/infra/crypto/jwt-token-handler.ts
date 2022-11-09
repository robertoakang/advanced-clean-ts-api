import { ITokenGenerator, ITokenValidator } from '@/domain/contracts/gateways'

import { JwtPayload, sign, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements ITokenGenerator, ITokenValidator {
  constructor (private readonly secret: string) {}

  async generate ({ expirationInMs, key }: ITokenGenerator.Input): Promise<ITokenGenerator.Output> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }

  async validate ({ token }: ITokenValidator.Input): Promise<ITokenValidator.Output> {
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }
}
