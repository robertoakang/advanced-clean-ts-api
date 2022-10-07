import { AuthenticationError } from '@/domain/errors'
import { ILoadFacebookUserApi } from '@/data/contracts/apis'
import { IFacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: ILoadFacebookUserApi
  ) {}

  async perform (params: IFacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserApi.loadUser(params)
    return new AuthenticationError()
  }
}
