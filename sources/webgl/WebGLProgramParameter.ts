export type WebGLProgramParameter = GLenum

export namespace WebGLProgramParameter {
  export const LINK_STATUS       : WebGLProgramParameter = 0x8B82
  export const ACTIVE_ATTRIBUTES : WebGLProgramParameter = 0x8B89
  export const ACTIVE_UNIFORMS   : WebGLProgramParameter = 0x8B86

  export const ALL         : WebGLProgramParameter[] = [
    LINK_STATUS,
    ACTIVE_ATTRIBUTES,
    ACTIVE_UNIFORMS
  ]

  /**
  * Stringify the given constant.
  *
  * @param value - A constant.
  *
  * @return The label associated with the given constant.
  */
  export function toString (value : WebGLProgramParameter) : string {
    switch (value) {
      case LINK_STATUS       : return 'LINK_STATUS'
      case ACTIVE_ATTRIBUTES : return 'ACTIVE_ATTRIBUTES'
      case ACTIVE_UNIFORMS   : return 'ACTIVE_UNIFORMS'
      default                : return undefined
    }
  }
}
