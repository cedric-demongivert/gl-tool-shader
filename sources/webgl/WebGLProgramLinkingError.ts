export class WebGLProgramLinkingError extends Error {
  public readonly context : WebGLRenderingContext
  public readonly program : WebGLProgram

  /**
  * Create a new program link error.
  *
  * @param context - WebGL context in wich the program failed to link.
  * @param program - The program that throwed the error.
  */
  public constructor (context : WebGLRenderingContext, program : WebGLProgram) {
    super(
      'Program linking failed. \r\n\r\n' +
      'Log :\r\n' +
      context.getProgramInfoLog(program)
    )

    this.program  = program
    this.context  = context
  }
}
