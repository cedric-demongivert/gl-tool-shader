export type WebGLFieldType = GLenum

export namespace WebGLFieldType {
  export const BYTE           : WebGLFieldType = 0x1400
  export const SHORT          : WebGLFieldType = 0x1402
  export const UNSIGNED_BYTE  : WebGLFieldType = 0x1401
  export const UNSIGNED_SHORT : WebGLFieldType = 0x1403
  export const UNSIGNED_INT   : WebGLFieldType = 0x1405
  export const FLOAT          : WebGLFieldType = 0x1406
  export const FLOAT_VEC2     : WebGLFieldType = 0x8B50
  export const FLOAT_VEC3     : WebGLFieldType = 0x8B51
  export const FLOAT_VEC4     : WebGLFieldType = 0x8B52
  export const FLOAT_MAT2     : WebGLFieldType = 0x8B5A
  export const FLOAT_MAT3     : WebGLFieldType = 0x8B5B
  export const FLOAT_MAT4     : WebGLFieldType = 0x8B5C
  export const INT            : WebGLFieldType = 0x1404
  export const INT_VEC2       : WebGLFieldType = 0x8B53
  export const INT_VEC3       : WebGLFieldType = 0x8B54
  export const INT_VEC4       : WebGLFieldType = 0x8B55
  export const BOOL           : WebGLFieldType = 0x8B56
  export const BOOL_VEC2      : WebGLFieldType = 0x8B57
  export const BOOL_VEC3      : WebGLFieldType = 0x8B58
  export const BOOL_VEC4      : WebGLFieldType = 0x8B59
  export const SAMPLER_2D     : WebGLFieldType = 0x8B5E
  export const SAMPLER_CUBE   : WebGLFieldType = 0x8B60

  export const ALL            : WebGLFieldType[] = [
    BYTE,
    UNSIGNED_BYTE,
    SHORT,
    UNSIGNED_SHORT,
    INT,
    UNSIGNED_INT,
    FLOAT_VEC2,
    FLOAT_VEC3,
    FLOAT_VEC4,
    INT_VEC2,
    INT_VEC3,
    INT_VEC4,
    BOOL,
    BOOL_VEC2,
    BOOL_VEC3,
    BOOL_VEC4,
    FLOAT_MAT2,
    FLOAT_MAT3,
    FLOAT_MAT4,
    SAMPLER_2D,
    SAMPLER_CUBE
  ]

  /**
  * Stringify the given constant.
  *
  * @param value - A constant.
  *
  * @return The label associated with the given constant.
  */
  export function toString (value : WebGLFieldType) : string {
    switch (value) {
      case BYTE           : return 'BYTE'
      case UNSIGNED_BYTE  : return 'UNSIGNED_BYTE'
      case SHORT          : return 'SHORT'
      case UNSIGNED_SHORT : return 'UNSIGNED_SHORT'
      case INT            : return 'INT'
      case UNSIGNED_INT   : return 'UNSIGNED_INT'
      case FLOAT          : return 'FLOAT'
      case FLOAT_VEC2     : return 'FLOAT_VEC2'
      case FLOAT_VEC3     : return 'FLOAT_VEC3'
      case FLOAT_VEC4     : return 'FLOAT_VEC4'
      case INT_VEC2       : return 'INT_VEC2'
      case INT_VEC3       : return 'INT_VEC3'
      case INT_VEC4       : return 'INT_VEC4'
      case BOOL           : return 'BOOL'
      case BOOL_VEC2      : return 'BOOL_VEC2'
      case BOOL_VEC3      : return 'BOOL_VEC3'
      case BOOL_VEC4      : return 'BOOL_VEC4'
      case FLOAT_MAT2     : return 'FLOAT_MAT2'
      case FLOAT_MAT3     : return 'FLOAT_MAT3'
      case FLOAT_MAT4     : return 'FLOAT_MAT4'
      case SAMPLER_2D     : return 'SAMPLER_2D'
      case SAMPLER_CUBE   : return 'SAMPLER_CUBE'
      default             : return undefined
    }
  }

  /**
  * Return the scalar type that compose the given type.
  *
  * @param value - Data type.
  *
  * @return The type of scalar that compose the given type.
  */
  export function scalar (value : WebGLFieldType) : WebGLFieldType {
    switch (value) {
      case BYTE:
        return BYTE
      case UNSIGNED_BYTE:
        return UNSIGNED_BYTE
      case INT:
      case INT_VEC2:
      case INT_VEC3:
      case INT_VEC4:
        return INT
      case UNSIGNED_INT:
        return UNSIGNED_INT
      case SHORT:
        return SHORT
      case FLOAT:
      case FLOAT_VEC2:
      case FLOAT_VEC3:
      case FLOAT_VEC4:
      case FLOAT_MAT2:
      case FLOAT_MAT3:
      case FLOAT_MAT4:
        return FLOAT
      case BOOL:
      case BOOL_VEC2:
      case BOOL_VEC3:
      case BOOL_VEC4:
        return BOOL
      default:
        return undefined
    }
  }

  /**
  * Return the number of scalars that compose the given type.
  *
  * @param value - Data type.
  *
  * @return The number of scalars that compose the given type.
  */
  export function scalarSize (value : WebGLFieldType) : number {
    switch (value) {
      case BYTE:
      case UNSIGNED_BYTE:
      case INT:
      case UNSIGNED_INT:
      case SHORT:
      case FLOAT:
        return 1
      case INT_VEC2:
      case FLOAT_VEC2:
        return 2
      case INT_VEC3:
      case FLOAT_VEC3:
        return 3
      case INT_VEC4:
      case FLOAT_VEC4:
      case FLOAT_MAT2:
        return 4
      case FLOAT_MAT3:
        return 9
      case FLOAT_MAT4:
        return 16
      default:
        return undefined
    }
  }
}
