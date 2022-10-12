import { ILoadFacebookUserApi } from '@/data/contracts/apis'
import { ITokenGenerator } from '@/data/contracts/crypto'
import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { IFacebookAuthentication } from '@/domain/features'
import { AccessToken, FacebookAccount } from '@/domain/models'

export class FacebookAuthenticationService implements IFacebookAuthentication {
  constructor (
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepo: ILoadUserAccountRepository & ISaveFacebookAccountRepository,
    private readonly crypto: ITokenGenerator
  ) {}

  async perform (params: IFacebookAuthentication.Params): Promise<IFacebookAuthentication.Result> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount)
      const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
      return new AccessToken(token)
    }

    return new AuthenticationError()
  }
}
