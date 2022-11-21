import { IHttpGetClient } from '@/infra/gateways'

import axios from 'axios'

export class AxiosHttpClient implements IHttpGetClient {
  async get ({ url, params }: IHttpGetClient.Input): Promise<any> {
    const result = await axios.get(url, { params })
    return result.data
  }
}
