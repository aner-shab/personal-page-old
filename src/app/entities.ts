export enum Type{
  File,
  Directory
}

export interface File{
  name: string;
  type: Type;
  extension: string;
  contents: File[];
}
