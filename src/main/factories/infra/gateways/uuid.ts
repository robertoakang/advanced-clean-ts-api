import { UUIDHandler, UniqueId } from '@/infra/gateways'

export const makeUUIDHandler = (): UUIDHandler => new UUIDHandler()

export const makeUniqueId = (): UniqueId => new UniqueId()
