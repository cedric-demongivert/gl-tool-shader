import { WebGLFieldType } from './WebGLFieldType'

export type WebGLAttributeMetadata = {
  name: string,
  size: number,
  type: WebGLFieldType,
  location: number
}
