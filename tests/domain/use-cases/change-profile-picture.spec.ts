import { mock, MockProxy } from 'jest-mock-extended'

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
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<IUploadFile>
  let crypto: MockProxy<IUUIDGenerator>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock<IUploadFile>()
    crypto = mock<IUUIDGenerator>()
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto)
  })

  it('Should call IUploadFile with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
