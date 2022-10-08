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

export interface ISaveFacebookAccountRepository {
  saveWithFacebook: (params: ISaveFacebookAccountRepository.Params) => Promise<void>
}

export namespace ISaveFacebookAccountRepository {
  export type Params = {
    id?: string
    email: string
    name: string
    facebookId: string
  }
}
