export interface ILoadFacebookUserApi {
  loadUser: (params: ILoadFacebookUserApi.Input) => Promise<ILoadFacebookUserApi.Output>
}

export namespace ILoadFacebookUserApi {
  export type Input = {
    token: string
  }

  export type Output = undefined | {
    facebookId: string
    email: string
    name: string
  }
}
