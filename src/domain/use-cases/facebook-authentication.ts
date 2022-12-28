import { ILoadFacebookUser, ITokenGenerator } from '@/domain/contracts/gateways'
import { ILoadUserAccount, ISaveFacebookAccount } from '@/domain/contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/entities/errors'

type Setup = (facebook: ILoadFacebookUser, userAccountRepo: ILoadUserAccount & ISaveFacebookAccount, token: ITokenGenerator) => FacebookAuthentication
type Input = { token: string }
type Output = { accessToken: string }
export type FacebookAuthentication = (input: Input) => Promise<Output>

export const setupFacebookAuthentication: Setup = (facebook, userAccountRepo, token) => async input => {
  const fbData = await facebook.loadUser(input)
  if (fbData !== undefined) {
    const accountData = await userAccountRepo.load({ email: fbData.email })
    const fbAccount = new FacebookAccount(fbData, accountData)
    const { id } = await userAccountRepo.saveWithFacebook(fbAccount)
    const accessToken = await token.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
    return { accessToken }
  }

  throw new AuthenticationError()
}
