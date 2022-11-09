export interface ILoadFacebookUser {
  loadUser: (input: ILoadFacebookUser.Input) => Promise<ILoadFacebookUser.Output>
}

export namespace ILoadFacebookUser {
  export type Input = {
    token: string
  }

  export type Output = undefined | {
    facebookId: string
    email: string
    name: string
  }
}
