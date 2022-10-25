import { Controller } from '@/application/controllers'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { IValidator, ValidationBuilder as builder } from '@/application/validation'
import { IFacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/entities'

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: IFacebookAuthentication) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication.perform({ token })
    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized()
  }

  override buildValidators ({ token }: HttpRequest): IValidator[] {
    return [
      ...builder.of({ value: token, fieldName: 'token' }).required().build()
    ]
  }
}
