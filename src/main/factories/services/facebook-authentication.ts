import { FacebookAuthenticationService } from '@/data/services'
import { makeFacebookApi } from '@/main/factories/apis'
import { makeJwTokenGenerator } from '@/main/factories/cryptos'
import { makePgUserAccountRepo } from '@/main/factories/repos'

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  return new FacebookAuthenticationService(makeFacebookApi(), makePgUserAccountRepo(), makeJwTokenGenerator())
}
