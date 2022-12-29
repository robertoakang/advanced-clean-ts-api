import { PgUser } from '@/infra/repos/postgres/entities'
import { TransactionNotFoundError, PgConnection, ConnectionNotFoundError } from '@/infra/repos/postgres/helpers'

import { createConnection, getConnection, getConnectionManager, getRepository } from 'typeorm'

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnection: jest.fn(),
  getConnectionManager: jest.fn(),
  getRepository: jest.fn()
}))

describe('PgConnection', () => {
  let getConnectionManagerSpy: jest.Mock
  let createQueryRunnerSpy: jest.Mock
  let createConnectionSpy: jest.Mock
  let hasSpy: jest.Mock
  let getConnectionSpy: jest.Mock
  let closeSpy: jest.Mock
  let startTransactionSpy: jest.Mock
  let releaseSpy: jest.Mock
  let commitTransactionSpy: jest.Mock
  let rollbackTransactionSpy: jest.Mock
  let getRepositorySpy: jest.Mock
  let sut: PgConnection

  beforeAll(() => {
    hasSpy = jest.fn().mockReturnValue(true)
    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: hasSpy
    })
    jest.mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy)
    startTransactionSpy = jest.fn()
    releaseSpy = jest.fn()
    commitTransactionSpy = jest.fn()
    rollbackTransactionSpy = jest.fn()
    getRepositorySpy = jest.fn().mockReturnValue('any_repo')
    createQueryRunnerSpy = jest.fn().mockReturnValue({
      startTransaction: startTransactionSpy,
      release: releaseSpy,
      commitTransaction: commitTransactionSpy,
      rollbackTransaction: rollbackTransactionSpy,
      manager: { getRepository: getRepositorySpy }
    })
    createConnectionSpy = jest.fn().mockResolvedValue({
      createQueryRunner: createQueryRunnerSpy
    })
    jest.mocked(createConnection).mockImplementation(createConnectionSpy)
    closeSpy = jest.fn()
    getConnectionSpy = jest.fn().mockReturnValue({
      createQueryRunner: createQueryRunnerSpy,
      close: closeSpy
    })
    jest.mocked(getConnection).mockImplementation(getConnectionSpy)
    jest.mocked(getRepository).mockImplementation(getRepositorySpy)
  })

  beforeEach(() => {
    sut = PgConnection.getInstance()
  })

  it('Should have only one instance - be a Singleton', () => {
    const sut2 = PgConnection.getInstance()

    expect(sut).toBe(sut2)
  })

  it('Should create a new connection', async () => {
    hasSpy.mockReturnValueOnce(false)

    await sut.connect()

    expect(createConnectionSpy).toHaveBeenCalledWith()
    expect(createConnectionSpy).toHaveBeenCalledTimes(1)
  })

  it('Should use an existing connection', async () => {
    await sut.connect()

    expect(createConnectionSpy).not.toHaveBeenCalledWith()
    expect(getConnectionSpy).toHaveBeenCalledWith()
    expect(getConnectionSpy).toHaveBeenCalledTimes(1)
  })

  it('Should close connection', async () => {
    await sut.connect()
    await sut.disconnect()

    expect(closeSpy).toHaveBeenCalledWith()
    expect(closeSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return ConnectionNotFoundError on disconnect without existing connection', async () => {
    const promise = sut.disconnect()

    expect(closeSpy).not.toHaveBeenCalledWith()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  it('Should open transaction', async () => {
    await sut.connect()
    await sut.openTransaction()

    expect(startTransactionSpy).toHaveBeenCalledWith()
    expect(startTransactionSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)

    await sut.disconnect()
  })

  it('Should return ConnectionNotFoundError on openTransaction without existing connection', async () => {
    const promise = sut.openTransaction()

    expect(startTransactionSpy).not.toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).not.toHaveBeenCalledWith()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  it('Should close transaction', async () => {
    await sut.connect()
    await sut.openTransaction()
    await sut.closeTransaction()

    expect(releaseSpy).toHaveBeenCalledWith()
    expect(releaseSpy).toHaveBeenCalledTimes(1)

    await sut.disconnect()
  })

  it('Should return TransactionNotFoundError on closeTransaction without existing transaction', async () => {
    const promise = sut.closeTransaction()

    expect(releaseSpy).not.toHaveBeenCalledWith()
    await expect(promise).rejects.toThrow(new TransactionNotFoundError())
  })

  it('Should commit transaction', async () => {
    await sut.connect()
    await sut.openTransaction()
    await sut.commit()

    expect(commitTransactionSpy).toHaveBeenCalledWith()
    expect(commitTransactionSpy).toHaveBeenCalledTimes(1)

    await sut.disconnect()
  })

  it('Should return TransactionNotFoundError on commit without existing transaction', async () => {
    const promise = sut.commit()

    expect(commitTransactionSpy).not.toHaveBeenCalledWith()
    await expect(promise).rejects.toThrow(new TransactionNotFoundError())
  })

  it('Should rollback transaction', async () => {
    await sut.connect()
    await sut.openTransaction()
    await sut.rollback()

    expect(rollbackTransactionSpy).toHaveBeenCalledWith()
    expect(rollbackTransactionSpy).toHaveBeenCalledTimes(1)

    await sut.disconnect()
  })

  it('Should return TransactionNotFoundError on rollback without existing transaction', async () => {
    const promise = sut.rollback()

    expect(rollbackTransactionSpy).not.toHaveBeenCalledWith()
    await expect(promise).rejects.toThrow(new TransactionNotFoundError())
  })

  it('Should get repository from transaction', async () => {
    await sut.connect()
    await sut.openTransaction()
    const repository = await sut.getRepository(PgUser)

    expect(getRepositorySpy).toHaveBeenCalledWith(PgUser)
    expect(getRepositorySpy).toHaveBeenCalledTimes(1)
    expect(repository).toBe('any_repo')

    await sut.disconnect()
  })

  it('Should get repository', async () => {
    await sut.connect()
    const repository = await sut.getRepository(PgUser)

    expect(getRepositorySpy).toHaveBeenCalledWith(PgUser)
    expect(getRepositorySpy).toHaveBeenCalledTimes(1)
    expect(repository).toBe('any_repo')

    await sut.disconnect()
  })

  it('Should return ConnectionNotFoundError on getRepository without existing transaction', async () => {
    expect(getRepositorySpy).not.toHaveBeenCalledWith()
    expect(() => sut.getRepository(PgUser)).toThrow(new ConnectionNotFoundError())
  })
})
