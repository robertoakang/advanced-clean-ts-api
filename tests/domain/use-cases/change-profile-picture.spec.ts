import { IDeleteFile, IUUIDGenerator, IUploadFile } from '@/domain/contracts/gateways'
import { ILoadUserProfile, ISaveUserPicture } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'

import { MockProxy, mock } from 'jest-mock-extended'

jest.mock('@/domain/entities/user-profile')

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: { buffer: Buffer, mimeType: string }
  let buffer: Buffer
  let mimeType: string
  let fileStorage: MockProxy<IUploadFile & IDeleteFile>
  let crypto: MockProxy<IUUIDGenerator>
  let userProfileRepo: MockProxy<ISaveUserPicture & ILoadUserProfile>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = { buffer, mimeType }
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
    await sut({ id: 'any_id', file: { buffer, mimeType: 'image/png' } })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, fileName: `${uuid}.png` })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('Should call IUploadFile with correct input', async () => {
    await sut({ id: 'any_id', file: { buffer, mimeType: 'image/jpeg' } })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, fileName: `${uuid}.jpeg` })
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

  it('Should call ISaveUserPicture with correct input', async () => {
    userProfileRepo.load.mockResolvedValueOnce(undefined)
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

  it('Should call IDeleteFile when file exists and ISaveUserPicture throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error())
    expect.assertions(2)

    const promise = sut({ id: 'any_id', file })

    promise.catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledWith({ fileName: uuid })
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    })
  })

  it('Should not call IDeleteFile when file does not exists and ISaveUserPicture throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error())
    expect.assertions(1)

    const promise = sut({ id: 'any_id', file: undefined })

    promise.catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled()
    })
  })

  it('Should rethrow if ISaveUserPicture throws', async () => {
    const error = new Error('save_error')
    userProfileRepo.savePicture.mockRejectedValueOnce(error)

    const promise = sut({ id: 'any_id', file: undefined })

    await expect(promise).rejects.toThrow(error)
  })

  it('Should rethrow if IUploadFile throws', async () => {
    const error = new Error('upload_error')
    fileStorage.upload.mockRejectedValueOnce(error)

    const promise = sut({ id: 'any_id', file })

    await expect(promise).rejects.toThrow(error)
  })

  it('Should rethrow if ILoadUserProfile throws', async () => {
    const error = new Error('load_error')
    userProfileRepo.load.mockRejectedValueOnce(error)

    const promise = sut({ id: 'any_id', file: undefined })

    await expect(promise).rejects.toThrow(error)
  })

  it('Should rethrow if IUUIDGenerator throws', async () => {
    const error = new Error('uuid_error')
    crypto.uuid.mockImplementationOnce(() => { throw error })

    const promise = sut({ id: 'any_id', file })

    await expect(promise).rejects.toThrow(error)
  })
})
