export interface ISaveUserPicture {
  savePicture: (input: ISaveUserPicture.Input) => Promise<void>
}

export namespace ISaveUserPicture {
  export type Input = {
    id: string
    pictureUrl?: string
    initials?: string
  }
}

export interface ILoadUserProfile {
  load: (input: ILoadUserProfile.Input) => Promise<ILoadUserProfile.Output>
}

export namespace ILoadUserProfile {
  export type Input = { id: string }
  export type Output = { name?: string } | undefined
}
