import { IHttpGetClient } from '@/infra/http'

import axios from 'axios'

export class AxiosHttpClient implements IHttpGetClient {
  async get (args: IHttpGetClient.Params): Promise<any> {
    const result = await axios.get(args.url, { params: args.params })
    return result.data
  }
}
