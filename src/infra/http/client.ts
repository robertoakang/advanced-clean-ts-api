export interface IHttpGetClient {
  get: <T = any> (args: IHttpGetClient.Params) => Promise<T>
}
export namespace IHttpGetClient {
  export type Params = {
    url: string
    params: object
  }
}
