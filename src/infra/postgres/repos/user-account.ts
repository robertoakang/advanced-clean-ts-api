import { ILoadUserAccount, ISaveFacebookAccount } from '@/domain/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

import { getRepository } from 'typeorm'

type LoadInput = ILoadUserAccount.Input
type LoadOutput = ILoadUserAccount.Output
type SaveInput = ISaveFacebookAccount.Input
type SaveOutput = ISaveFacebookAccount.Output
export class PgUserAccountRepository implements ILoadUserAccount, ISaveFacebookAccount {
  async load ({ email }: LoadInput): Promise<LoadOutput> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ id, email, name, facebookId }: SaveInput): Promise<SaveOutput> {
    const pgUserRepo = getRepository(PgUser)
    let resultId: string
    if (id === undefined) {
      const pgUser = await pgUserRepo.save({ email, name, facebookId })
      resultId = pgUser.id.toString()
    } else {
      resultId = id
      await pgUserRepo.update({ id: parseInt(id) }, { name, facebookId })
    }
    return { id: resultId }
  }
}
