export type ShaderType = GLenum

export namespace ShaderType {
  export const FRAGMENT : ShaderType = 0
  export const VERTEX   : ShaderType = 1

  export const ALL             : ShaderType[] = [
    FRAGMENT,
    VERTEX
  ]

  /**
  * Stringify the given constant.
  *
  * @param value - A constant.
  *
  * @return The label associated with the given constant.
  */
  export function toString (type : ShaderType) : string {
    switch (type) {
      case FRAGMENT : return 'FRAGMENT'
      case VERTEX   : return 'VERTEX'
      default       : return undefined
    }
  }
}
