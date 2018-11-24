export class ProgramLinkingError extends Error {
  /**
  * Create a new program link error.
  *
  * @param {GLProgram} program - The program that throwed the error.
  */
  constructor (program) {
    super([
      'Program linking failed. \n\n',
      'Log :\n',
      program.logs
    ].join(''))

    this._program = program
    this._vertex = program.vertex
    this._fragment = program.fragment
  }

  /**
  * @return {GLShader} The vertex shader used when the error was throwed.
  */
  get vertex () {
    return this._vertex
  }

  /**
  * @return {GLShader} The fragment shader used when the error was throwed.
  */
  get fragment () {
    return this._fragment
  }

  /**
  * @return {GLProgram} The program that throwed the error.
  */
  get program () {
    return this._program
  }
}
