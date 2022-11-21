import { IUploadFile, IUUIDGenerator } from '@/domain/contracts/gateways'
import { ISaveUserPicture, ILoadUserProfile } from '@/domain/contracts/repos'

type Setup = (fileStorage: IUploadFile, crypto: IUUIDGenerator, userProfileRepo: ISaveUserPicture & ILoadUserProfile) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  let pictureUrl: string | undefined
  if (file !== undefined) {
    pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
  } else {
    await userProfileRepo.load({ id })
  }
  await userProfileRepo.savePicture({ pictureUrl })
}
