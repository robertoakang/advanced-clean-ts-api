export interface IHttpGetClient {
  get: (params: IHttpGetClient.Params) => Promise<IHttpGetClient.Result>
}
export namespace IHttpGetClient {
  export type Params = {
    url: string
    params: object
  }

  export type Result = any
}
