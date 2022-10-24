import { mock } from 'jest-mock-extended'

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
  it('Should return undefined if all validators returns undefined', () => {
    const validator1 = mock<IValidator>()
    validator1.validate.mockReturnValue(undefined)
    const validator2 = mock<IValidator>()
    validator2.validate.mockReturnValue(undefined)
    const sut = new ValidationComposite([validator1, validator2])

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
