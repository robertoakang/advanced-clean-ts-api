import { ILoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { ICreateFacebookAccountRepository, ILoadUserAccountRepository } from '@/data/contracts/repos'
import { IFacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: ILoadFacebookUserApi,
    private readonly loadUserAccountRepo: ILoadUserAccountRepository,
    private readonly createFacebookAccountRepo: ICreateFacebookAccountRepository
  ) {}

  async perform (params: IFacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(params)
    if (fbData !== undefined) {
      await this.loadUserAccountRepo.load({ email: fbData.email })
      await this.createFacebookAccountRepo.createFromFacebook(fbData)
    }
    return new AuthenticationError()
  }
}
