import { padStart } from 'lodash'

export class ShaderCompilationError extends Error {
  /**
  * Create a new shader compilation error.
  *
  * @param {GLShader} shader - The shader that throwed the error.
  */
  constructor (shader) {
    super([
      'Shader compilation failed. \n\n',
      'Source code : \n',
      shader.source.split(/\r\n|\n|\r/).map(
        (line, index, lines) => {
          return `${padStart(index + 1, `${lines.length}`.length)} :  ${line}`
        }
      ).join('\n'),
      '\n\n',
      'Log :\n',
      shader.logs
    ].join(''))

    this._shader = shader
    this._source = shader.source
  }

  /**
  * @return {string} The source used for the compilation.
  */
  get source () {
    return this._source
  }

  /**
  * @return {GLShader} The shader that throwed the error.
  */
  get shader () {
    return this._shader
  }
}
