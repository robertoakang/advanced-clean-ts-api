import { ILoadFacebookUserApi } from '@/data/contracts/apis'
import { ITokenGenerator } from '@/data/contracts/crypto'
import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { IFacebookAuthentication } from '@/domain/features'
import { FacebookAccount } from '@/domain/models'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepo: ILoadUserAccountRepository & ISaveFacebookAccountRepository,
    private readonly crypto: ITokenGenerator
  ) {}

  async perform (params: IFacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount)
      await this.crypto.generateToken({ key: id })
    }

    return new AuthenticationError()
  }
}
