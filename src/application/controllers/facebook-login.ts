import { RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse, ok, serverError, unauthorized } from '@/application/helpers'
import { IFacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { RequiredStringValidator } from '@/application/validation'

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: IFacebookAuthentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest)
      if (error !== undefined) {
        return badRequest(new RequiredFieldError('token'))
      }
      const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token })
      if (accessToken instanceof AccessToken) {
        return ok({
          accessToken: accessToken.value
        })
      } else {
        return unauthorized()
      }
    } catch (error: any) {
      return serverError(error)
    }
  }

  private validate (httpRequest: HttpRequest): Error | undefined {
    const validator = new RequiredStringValidator(httpRequest.token, 'token')
    return validator.validate()
  }
}
