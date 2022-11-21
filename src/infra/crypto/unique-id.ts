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
