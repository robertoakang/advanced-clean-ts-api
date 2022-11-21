import { mock } from 'jest-mock-extended'

type Setup = (fileStorage: IUploadFile) => ChangeProfilePicture
type Input = { id: string, file: Buffer }
type ChangeProfilePicture = (input: Input) => Promise<void>

const setupChangeProfilePicture: Setup = fileStorage => async ({ id, file }) => {
  await fileStorage.upload({ file, key: id })
}

interface IUploadFile {
  upload: (input: IUploadFile.Input) => Promise<void>
}

namespace IUploadFile {
  export type Input = { file: Buffer, key: string }
}

describe('ChangeProfilePicture', () => {
  it('Should call IUploadFile with correct input', async () => {
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<IUploadFile>()
    const sut = setupChangeProfilePicture(fileStorage)

    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_id' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
