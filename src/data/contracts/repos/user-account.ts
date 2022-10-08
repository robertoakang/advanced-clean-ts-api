export interface ILoadUserAccountRepository {
  load: (params: ILoadUserAccountRepository.Params) => Promise<ILoadUserAccountRepository.Result>
}

export namespace ILoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string
    name?: string
  }
}

export interface ICreateFacebookAccountRepository {
  createFromFacebook: (params: ILoadUserAccountRepository.Params) => Promise<void>
}

export namespace ICreateFacebookAccountRepository {
  export type Params = {
    facebookId: string
    email: string
    name: string
  }
}

export interface IUpdateFacebookAccountRepository {
  updateWithFacebook: (params: IUpdateFacebookAccountRepository.Params) => Promise<void>
}

export namespace IUpdateFacebookAccountRepository {
  export type Params = {
    id: string
    name: string
    facebookId: string
  }
}
