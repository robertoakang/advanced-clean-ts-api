import { mock } from 'jest-mock-extended'

type Setup = (fileStorage: IUploadFile, crypto: IUUIDGenerator) => ChangeProfilePicture
type Input = { id: string, file: Buffer }
type ChangeProfilePicture = (input: Input) => Promise<void>

const setupChangeProfilePicture: Setup = (fileStorage, crypto) => async ({ id, file }) => {
  await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
}

interface IUploadFile {
  upload: (input: IUploadFile.Input) => Promise<void>
}

namespace IUploadFile {
  export type Input = { file: Buffer, key: string }
}
interface IUUIDGenerator {
  uuid: (input: IUUIDGenerator.Input) => IUUIDGenerator.Output
}

namespace IUUIDGenerator {
  export type Input = { key: string }
  export type Output = string
}

describe('ChangeProfilePicture', () => {
  it('Should call IUploadFile with correct input', async () => {
    const uuid = 'any_unique_id'
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<IUploadFile>()
    const crypto = mock<IUUIDGenerator>()
    crypto.uuid.mockReturnValue(uuid)
    const sut = setupChangeProfilePicture(fileStorage, crypto)

    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
