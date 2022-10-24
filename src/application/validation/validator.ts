export interface IValidator {
  validate: () => Error | undefined
}
