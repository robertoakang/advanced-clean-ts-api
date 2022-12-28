import { RequiredFieldError } from '@/application/errors'
import { Required, RequiredString } from '@/application/validation'

describe('Required', () => {
  it('Should return RequiredFieldError if value is null', () => {
    const sut = new Required(null as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('Should return RequiredFieldError if undefined is null', () => {
    const sut = new Required(undefined as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('Should return undefined if value is not empty', () => {
    const sut = new Required('any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})

describe('RequiredString', () => {
  it('Should extend Required', () => {
    const sut = new RequiredString('')

    expect(sut).toBeInstanceOf(Required)
  })

  it('Should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredString('', 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('Should return undefined if value is not empty', () => {
    const sut = new RequiredString('any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})
