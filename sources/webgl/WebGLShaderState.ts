export type WebGLShaderState = number

export namespace WebGLShaderState {
  /**
  * When a shader is declared but not instantiated into the current context.
  */
  export const BLANK : WebGLShaderState = 0

  /**
  * When a shader is compiled and ready for use.
  */
  export const READY : WebGLShaderState = 1

  /**
  * When a shader is instantiated but not compiled, or compiled but not
  * synchronized with it's description.
  */
  export const DIRTY : WebGLShaderState = 2

  /**
  * When a shader failed it's last compilation attempt.
  */
  export const ERROR : WebGLShaderState = 3

  export const ALL   : WebGLShaderState[] = [
    BLANK,
    READY,
    DIRTY,
    ERROR
  ]

  /**
  * Stringify the given constant.
  *
  * @param value - A constant.
  *
  * @return The label associated with the given constant.
  */
  export function toString (value : WebGLShaderState) : string {
    switch (value) {
      case BLANK : return 'BLANK'
      case READY : return 'READY'
      case DIRTY : return 'DIRTY'
      case ERROR : return 'ERROR'
      default    : return undefined
    }
  }
}
