export type WebGLShaderParameter = GLenum

export namespace WebGLShaderParameter {
  export const COMPILE_STATUS : WebGLShaderParameter = 0x8B81

  export const ALL            : WebGLShaderParameter[] = [
    COMPILE_STATUS
  ]

  /**
  * Stringify the given constant.
  *
  * @param value - A constant.
  *
  * @return The label associated with the given constant.
  */
  export function toString (value : WebGLShaderParameter) : string {
    switch (value) {
      case COMPILE_STATUS : return 'COMPILE_STATUS'
      default                   : return undefined
    }
  }
}
