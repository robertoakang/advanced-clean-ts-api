import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'

export interface IFacebookAuthentication {
  perform: (params: IFacebookAuthentication.Params) => Promise<IFacebookAuthentication.Result>
}
namespace IFacebookAuthentication {
  export type Params = {
    token: string
  }

  export type Result = AccessToken | AuthenticationError
}
