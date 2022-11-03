import { ITokenGenerator, ITokenValidator } from '@/domain/contracts/crypto'

import { sign, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements ITokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken ({ expirationInMs, key }: ITokenGenerator.Params): Promise<ITokenGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }

  async validateToken ({ token }: ITokenValidator.Params): Promise<void> {
    verify(token, this.secret)
  }
}
