export interface ILoadUserAccountRepository {
  load: (params: ILoadUserAccountRepository.Params) => Promise<ILoadUserAccountRepository.Result>
}

export namespace ILoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined
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
