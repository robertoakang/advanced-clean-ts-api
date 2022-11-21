export interface ISaveUserPicture {
  savePicture: (input: ISaveUserPicture.Input) => Promise<void>
}

export namespace ISaveUserPicture {
  export type Input = { pictureUrl: string }
}
