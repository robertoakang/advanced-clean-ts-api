import { ILoadFacebookUserApi } from '@/data/contracts/apis'
import { ISaveFacebookAccountRepository, ILoadUserAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { IFacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepo: ILoadUserAccountRepository & ISaveFacebookAccountRepository
  ) {}

  async perform (params: IFacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: fbData.email })
      await this.userAccountRepo.saveWithFacebook({
        id: accountData?.id,
        name: accountData?.name ?? fbData.name,
        email: fbData.email,
        facebookId: fbData.facebookId
      })
    }

    return new AuthenticationError()
  }
}
