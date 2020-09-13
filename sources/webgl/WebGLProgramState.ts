export type WebGLProgramState = number

export namespace WebGLProgramState {
  /**
  * When a program is declared but not instantiated into the current context.
  */
  export const BLANK : WebGLProgramState = 0

  /**
  * When a program is linked and ready for use.
  */
  export const READY : WebGLProgramState = 1

  /**
  * When a program is instantiated but not linked, or linked but not
  * synchronized with it's description.
  */
  export const DIRTY : WebGLProgramState = 2

  /**
  * When a program failed it's last linking attempt.
  */
  export const ERROR : WebGLProgramState = 3

  export const ALL   : WebGLProgramState[] = [
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
  export function toString (value : WebGLProgramState) : string {
    switch (value) {
      case BLANK : return 'BLANK'
      case READY : return 'READY'
      case DIRTY : return 'DIRTY'
      case ERROR : return 'ERROR'
      default    : return undefined
    }
  }
}
