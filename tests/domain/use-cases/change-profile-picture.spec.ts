import { IUploadFile, IUUIDGenerator } from '@/domain/contracts/gateways'
import { ILoadUserProfile, ISaveUserPicture } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'

import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/entities/user-profile')

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<IUploadFile>
  let crypto: MockProxy<IUUIDGenerator>
  let userProfileRepo: MockProxy<ISaveUserPicture & ILoadUserProfile>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    crypto = mock()
    userProfileRepo = mock()
    userProfileRepo.load.mockResolvedValue({ name: 'Roberto Arruda Kang' })
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

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(...jest.mocked(UserProfile).mock.instances)
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call ILoadUserProfile with correct input', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.load).toHaveBeenCalledWith({ id: 'any_id' })
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should not call ILoadUserProfile if file exists', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.load).not.toHaveBeenCalled()
  })

  it('Should return correct data on success', async () => {
    jest.mocked(UserProfile).mockImplementationOnce(id => ({
      setPicture: jest.fn(),
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'any_initials'
    }))

    const result = await sut({ id: 'any_id', file })

    expect(result).toMatchObject({
      pictureUrl: 'any_url',
      initials: 'any_initials'
    })
  })
})
