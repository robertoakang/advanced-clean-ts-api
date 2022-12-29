import { PgUser } from '@/infra/repos/postgres/entities'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { ILoadUserProfile, ISaveUserPicture } from '@/domain/contracts/repos'

export class PgUserProfileRepository extends PgRepository implements ISaveUserPicture, ILoadUserProfile {
  async savePicture ({ id, pictureUrl, initials }: ISaveUserPicture.Input): Promise<void> {
    const pgUserRepo = this.getRepository(PgUser)
    await pgUserRepo.update({ id: parseInt(id) }, { pictureUrl, initials })
  }

  async load ({ id }: ILoadUserProfile.Input): Promise<ILoadUserProfile.Output> {
    const pgUserRepo = this.getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ id: parseInt(id) })
    if (pgUser !== undefined) return { name: pgUser.name ?? undefined }
  }
}
