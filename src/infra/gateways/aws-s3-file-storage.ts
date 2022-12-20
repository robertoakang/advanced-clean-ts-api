import { IDeleteFile, IUploadFile } from '@/domain/contracts/gateways'

import { config, S3 } from 'aws-sdk'

export class AwsS3FileStorage implements IUploadFile, IDeleteFile {
  constructor (
    private readonly accessKey: string,
    private readonly secretKey: string,
    private readonly bucket: string
  ) {
    config.update({
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey
      }
    })
  }

  async upload ({ key, file }: IUploadFile.Input): Promise<IUploadFile.Output> {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    }).promise()

    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`
  }

  async delete ({ key }: IDeleteFile.Input): Promise<void> {
    const s3 = new S3()
    await s3.deleteObject({
      Bucket: this.bucket,
      Key: key
    }).promise()
  }
}
