import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  let sut: UserProfile

  beforeEach(() => {
    sut = new UserProfile('any_id')
  })

  it('Should create with empty initials when pictureUrl and name are provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('Should create with empty initials when only pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('Should create initials with first letter of first and last name when pictureUrl is not provided', () => {
    sut.setPicture({ name: 'roberto arruda kang' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'RK'
    })
  })

  it('Should create initials with first two letters of first name when pictureUrl is not provided', () => {
    sut.setPicture({ name: 'roberto' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'RO'
    })
  })

  it('Should create with empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({ name: 'r' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'R'
    })
  })

  it('Should create initials with first letter when pictureUrl is not provided', () => {
    sut.setPicture({})

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })
})
