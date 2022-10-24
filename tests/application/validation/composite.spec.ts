import { mock, MockProxy } from 'jest-mock-extended'

interface IValidator {
  validate: () => Error | undefined
}

class ValidationComposite {
  constructor (private readonly validators: IValidator[]) {}

  validate (): undefined {
    return undefined
  }
}

describe('ValidationComposite', () => {
  let sut: ValidationComposite
  let validator1: MockProxy<IValidator>
  let validator2: MockProxy<IValidator>
  let validators: IValidator[]

  beforeAll(() => {
    validator1 = mock()
    validator1.validate.mockReturnValue(undefined)
    validator2 = mock()
    validator2.validate.mockReturnValue(undefined)
    validators = [validator1, validator2]
  })

  beforeEach(() => {
    sut = new ValidationComposite(validators)
  })

  it('Should return undefined if all validators returns undefined', () => {
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
