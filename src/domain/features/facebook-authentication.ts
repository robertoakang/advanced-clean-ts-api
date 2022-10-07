import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'

export interface IFacebookAuthentication {
  perform: (params: IFacebookAuthentication.Params) => Promise<IFacebookAuthentication.Result>
}

export namespace IFacebookAuthentication {
  export type Params = {
    token: string
  }

  export type Result = AccessToken | AuthenticationError
}
