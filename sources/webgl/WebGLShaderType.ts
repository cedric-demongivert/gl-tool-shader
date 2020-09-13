export type WebGLShaderType = GLenum

export namespace WebGLShaderType {
  export const FRAGMENT_SHADER : WebGLShaderType = 0x8B30
  export const VERTEX_SHADER   : WebGLShaderType = 0x8B31

  export const ALL             : WebGLShaderType[] = [
    FRAGMENT_SHADER,
    VERTEX_SHADER
  ]

  /**
  * Stringify the given constant.
  *
  * @param value - A constant.
  *
  * @return The label associated with the given constant.
  */
  export function toString (type : WebGLShaderType) : string {
    switch (type) {
      case FRAGMENT_SHADER : return 'FRAGMENT_SHADER'
      case VERTEX_SHADER   : return 'VERTEX_SHADER'
      default              : return undefined
    }
  }
}
