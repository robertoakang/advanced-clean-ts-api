import { JwtTokenGenerator } from '@/infra/crypto'
import { env } from '@/main/config/env'

export const makeJwTokenGenerator = (): JwtTokenGenerator => new JwtTokenGenerator(env.jwtSecret)
