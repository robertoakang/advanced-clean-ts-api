import { IUUIDGenerator } from '@/domain/contracts/gateways'

export class UniqueId implements IUUIDGenerator {
  uuid ({ key }: IUUIDGenerator.Input): IUUIDGenerator.Output {
    const date = new Date()
    return key +
      '_' +
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0') +
      date.getHours().toString().padStart(2, '0') +
      date.getMinutes().toString().padStart(2, '0') +
      date.getSeconds().toString().padStart(2, '0')
  }
}
