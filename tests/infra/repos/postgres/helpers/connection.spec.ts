import { createConnection, getConnectionManager } from 'typeorm'

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnectionManager: jest.fn()
}))
export class PgConnection {
  private static instance?: PgConnection

  private constructor () {}

  static getInstance (): PgConnection {
    if (PgConnection.instance === undefined) PgConnection.instance = new PgConnection()
    return PgConnection.instance
  }

  async connect (): Promise<void> {
    const connection = await createConnection()
    connection.createQueryRunner()
  }
}

describe('PgConnection', () => {
  it('Should have only one instance - be a Singleton', () => {
    const sut = PgConnection.getInstance()
    const sut2 = PgConnection.getInstance()

    expect(sut).toBe(sut2)
  })

  it('Should create a new connection', async () => {
    const getConnectionManagerSpy = jest.fn().mockReturnValueOnce({
      has: jest.fn().mockResolvedValueOnce(false)
    })
    jest.mocked(getConnectionManager).mockImplementationOnce(getConnectionManagerSpy)
    const createQueryRunnerSpy = jest.fn()
    const createConnectionSpy = jest.fn().mockResolvedValueOnce({
      createQueryRunner: createQueryRunnerSpy
    })
    jest.mocked(createConnection).mockImplementationOnce(createConnectionSpy)
    const sut = PgConnection.getInstance()

    await sut.connect()

    expect(createConnectionSpy).toHaveBeenCalledWith()
    expect(createConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })
})