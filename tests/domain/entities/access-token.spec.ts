import { AccessToken } from '@/domain/entities'

describe('AccessToken', () => {
  it('Should expires in 1800000 milliseconds', () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})
