import { ITokenGenerator } from '@/data/contracts/crypto'

import { sign } from 'jsonwebtoken'

type Params = ITokenGenerator.Params
type Result = ITokenGenerator.Result

export class JwtTokenGenerator implements ITokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken ({ expirationInMs, key }: Params): Promise<Result> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
