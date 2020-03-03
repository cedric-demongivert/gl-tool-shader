import { FieldType } from './FieldType'

export type AttributeMetadata = {
  name: string,
  size: number,
  type: FieldType,
  location: number
}
