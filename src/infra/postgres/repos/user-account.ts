import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@/data/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

import { getRepository } from 'typeorm'

type LoadParams = ILoadUserAccountRepository.Params
type LoadResult = ILoadUserAccountRepository.Result
type SaveParams = ISaveFacebookAccountRepository.Params
export class PgUserAccountRepository implements ILoadUserAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser)

  async load (params: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepo.findOne({ email: params.email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook (params: SaveParams): Promise<void> {
    if (params.id === undefined) {
      await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })
    } else {
      await this.pgUserRepo.update({
        id: parseInt(params.id)
      }, {
        name: params.name,
        facebookId: params.facebookId
      })
    }
  }
}
