import { IUUIDGenerator } from '@/domain/contracts/gateways'

import { v4 } from 'uuid'

jest.mock('uuid')

export class UUIDHandler {
  uuid ({ key }: IUUIDGenerator.Input): void {
    v4()
  }
}

describe('UUIDHandler', () => {
  it('Should call uuid.v4', () => {
    const sut = new UUIDHandler()

    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  it('Should call uuid.v4', () => {
    const sut = new UUIDHandler()

    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })
})
