export type ShaderParameter = GLenum

export namespace ShaderParameter {
  export const COMPILE_STATUS : ShaderParameter = 0x8B81

  export const ALL                  : ShaderParameter[] = [
    COMPILE_STATUS
  ]

  /**
  * Stringify the given constant.
  *
  * @param value - A constant.
  *
  * @return The label associated with the given constant.
  */
  export function toString (value : ShaderParameter) : string {
    switch (value) {
      case COMPILE_STATUS : return 'COMPILE_STATUS'
      default                   : return undefined
    }
  }
}
