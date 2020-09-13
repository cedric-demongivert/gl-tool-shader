export class WebGLShaderCompilationError extends Error {
  public readonly shader : WebGLShader
  public readonly webgl : WebGLRenderingContext

  /**
  * Instantiate a new shader compilation error.
  *
  * @param webgl - The context in which the shader failed to compile.
  * @param shader - Shader that failed to compile.
  */
  public constructor (webgl : WebGLRenderingContext, shader : WebGLShader) {
    super(
      'Shader compilation failed. \r\n\r\n' +
      'Source code : \r\n' + (
        webgl.getShaderSource(shader).split(/\r\n|\n|\r/).map(
          (line : string, index : number, lines : string[]) => (
            (index + 1).toString().padStart(`${lines.length}`.length, ' ') +
            ' : ' + line
          )
        ).join('\r\n')
      ) +
      '\r\n\r\n' +
      'Log :\r\n' +
      webgl.getShaderInfoLog(shader)
    )

    this.shader = shader
    this.webgl = webgl
  }
}
