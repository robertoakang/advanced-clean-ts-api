import { IValidator, RequiredStringValidator } from '@/application/validation'

export class ValidationBuilder {
  private constructor (
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: IValidator[] = []
  ) {}

  static of ({ value, fieldName }: { value: string, fieldName: string }): ValidationBuilder {
    return new ValidationBuilder(value, fieldName)
  }

  required (): ValidationBuilder {
    this.validators.push(new RequiredStringValidator(this.value, this.fieldName))
    return this
  }

  build (): IValidator[] {
    return this.validators
  }
}
