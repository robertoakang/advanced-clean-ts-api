
export interface ITokenGenerator {
  generateToken: (params: ITokenGenerator.Params) => Promise <void>
}

export namespace ITokenGenerator {
  export type Params = {
    key: string
  }
}
