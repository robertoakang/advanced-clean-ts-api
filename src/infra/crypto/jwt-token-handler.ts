import { ITokenGenerator, ITokenValidator } from '@/domain/contracts/crypto'

import { JwtPayload, sign, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements ITokenGenerator, ITokenValidator {
  constructor (private readonly secret: string) {}

  async generateToken ({ expirationInMs, key }: ITokenGenerator.Input): Promise<ITokenGenerator.Output> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }

  async validateToken ({ token }: ITokenValidator.Input): Promise<ITokenValidator.Output> {
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }
}
