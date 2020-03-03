import { FieldType } from './FieldType'

export type UniformMetadata = {
  name: string,
  size: number,
  type: FieldType,
  location: WebGLUniformLocation
}
