import { WebGLFieldType } from './WebGLFieldType'

export type WebGLUniformMetadata = {
  name: string,
  size: number,
  type: WebGLFieldType,
  location: WebGLUniformLocation
}
