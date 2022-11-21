export interface ILoadUserAccount {
  load: (input: ILoadUserAccount.Input) => Promise<ILoadUserAccount.Output>
}

export namespace ILoadUserAccount {
  export type Input = { email: string }

  export type Output = undefined | {
    id: string
    name?: string
  }
}

export interface ISaveFacebookAccount {
  saveWithFacebook: (input: ISaveFacebookAccount.Input) => Promise<ISaveFacebookAccount.Output>
}

export namespace ISaveFacebookAccount {
  export type Input = {
    id?: string
    email: string
    name: string
    facebookId: string
  }

  export type Output = { id: string }
}
