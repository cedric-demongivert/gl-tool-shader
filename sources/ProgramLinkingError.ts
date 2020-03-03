import { GLProgram } from './GLProgram'
import { GLShader } from './GLShader'

export class ProgramLinkingError extends Error {
  public readonly program  : GLProgram
  public readonly vertex   : GLShader
  public readonly fragment : GLShader

  /**
  * Create a new program link error.
  *
  * @param program - The program that throwed the error.
  */
  constructor (program : GLProgram) {
    super(
      'Program linking failed. \r\n\r\n' +
      'Log :\r\n' +
      program.logs
    )

    this.program  = program
    this.vertex   = program.vertex
    this.fragment = program.fragment
  }
}
