import { IUploadFile, IUUIDGenerator } from '@/domain/contracts/gateways'

type Setup = (fileStorage: IUploadFile, crypto: IUUIDGenerator) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto) => async ({ id, file }) => {
  if (file !== undefined) {
    await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
  }
}
