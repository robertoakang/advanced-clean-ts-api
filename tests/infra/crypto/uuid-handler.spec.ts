import { IUUIDGenerator } from '@/domain/contracts/gateways'

import { v4 } from 'uuid'

jest.mock('uuid')

export class UUIDHandler implements IUUIDGenerator {
  uuid ({ key }: IUUIDGenerator.Input): IUUIDGenerator.Output {
    return `${key}_${v4()}`
  }
}

describe('UUIDHandler', () => {
  let sut: UUIDHandler

  beforeAll(() => {
    jest.mocked(v4).mockReturnValue('any_uuid')
  })

  beforeEach(() => {
    sut = new UUIDHandler()
  })

  it('Should call uuid.v4', () => {
    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  it('Should return correct uuid', () => {
    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_any_uuid')
  })
})
