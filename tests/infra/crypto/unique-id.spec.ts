// import { UUIDHandler } from '@/infra/crypto'
import { IUUIDGenerator } from '@/domain/contracts/gateways'

export class UniqueId implements IUUIDGenerator {
  constructor (private readonly date: Date) {}

  uuid ({ key }: IUUIDGenerator.Input): IUUIDGenerator.Output {
    return key +
      '_' +
      this.date.getFullYear().toString() +
      (this.date.getMonth() + 1).toString().padStart(2, '0') +
      this.date.getDate().toString().padStart(2, '0') +
      this.date.getHours().toString().padStart(2, '0') +
      this.date.getMinutes().toString().padStart(2, '0') +
      this.date.getSeconds().toString().padStart(2, '0')
  }
}

describe('UniqueId', () => {
  it('Should create a new uuid based on date', () => {
    const sut = new UniqueId(new Date(2022, 9, 3, 10, 10, 10))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20221003101010')
  })

  it('Should create a new uuid based on date', () => {
    const sut = new UniqueId(new Date(2018, 2, 10, 18, 1, 0))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20180310180100')
  })
})
