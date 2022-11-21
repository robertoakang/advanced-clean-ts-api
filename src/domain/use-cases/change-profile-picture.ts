import { IUploadFile, IUUIDGenerator, IDeleteFile } from '@/domain/contracts/gateways'
import { ILoadUserProfile, ISaveUserPicture } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'

type Setup = (fileStorage: IUploadFile & IDeleteFile, crypto: IUUIDGenerator, userProfileRepo: ISaveUserPicture & ILoadUserProfile) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
type Output = { pictureUrl?: string, initials?: string }
export type ChangeProfilePicture = (input: Input) => Promise<Output>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  const key = crypto.uuid({ key: id })
  const data = {
    pictureUrl: file !== undefined ? await fileStorage.upload({ file, key }) : undefined,
    name: file === undefined ? (await userProfileRepo.load({ id })).name : undefined
  }

  const userProfile = new UserProfile(id)
  userProfile.setPicture(data)

  try {
    await userProfileRepo.savePicture(userProfile)
  } catch (error) {
    if (file !== undefined) await fileStorage.delete({ key })
    throw error
  }

  return userProfile
}
