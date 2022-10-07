export interface ILoadUserAccountRepository {
  load: (params: ILoadUserAccountRepository.Params) => Promise<void>
}

export namespace ILoadUserAccountRepository {
  export type Params = {
    email: string
  }
}
