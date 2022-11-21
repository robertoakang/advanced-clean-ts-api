import { IUploadFile, IUUIDGenerator } from '@/domain/contracts/gateways'
import { ISaveUserPicture } from '@/domain/contracts/repos'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'

import { mock, MockProxy } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<IUploadFile>
  let crypto: MockProxy<IUUIDGenerator>
  let userProfileRepo: MockProxy<ISaveUserPicture>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    crypto = mock()
    userProfileRepo = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo)
  })

  it('Should call IUploadFile with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('Should not call IUploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  it('Should call ISaveUserPicture with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })
})
