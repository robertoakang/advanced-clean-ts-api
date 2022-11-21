import { IUploadFile, IUUIDGenerator } from '@/domain/contracts/gateways'
import { ISaveUserPicture } from '@/domain/contracts/repos'

type Setup = (fileStorage: IUploadFile, crypto: IUUIDGenerator, userProfileRepo: ISaveUserPicture) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  if (file !== undefined) {
    const pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
    await userProfileRepo.savePicture({ pictureUrl })
  }
}
