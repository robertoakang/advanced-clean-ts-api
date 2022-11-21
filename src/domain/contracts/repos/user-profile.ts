export interface ISaveUserPicture {
  savePicture: (input: ISaveUserPicture.Input) => Promise<void>
}

export namespace ISaveUserPicture {
  export type Input = { pictureUrl?: string }
}

export interface ILoadUserProfile {
  load: (input: ILoadUserProfile.Input) => Promise<void>
}

export namespace ILoadUserProfile {
  export type Input = { id: string }
}
