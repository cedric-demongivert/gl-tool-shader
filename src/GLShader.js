import { GLContextualisation, GLContext } from '@cedric-demongivert/gl-tool-core'
import { ShaderCompilationError } from './ShaderCompilationError'
import { Shader } from './Shader'
import { contextualise as contextualiseShaderType } from './ShaderType'

/**
* A webgl shader bound to a rendering context.
*/
export class GLShader extends GLContextualisation {
  /**
  * Create a new webgl shader from a shader description instance and a rendering context.
  *
  * @param {GLContext|WebGLRenderingContext} context - The webgl rendering context of this instance.
  * @param {Shader} shader - The shader descriptor to contextualise.
  */
  constructor (context, shader) {
    super(context, shader)
    this._shader = null
    this._source = null
    this._programs = new Set()
    this._compiled = false
  }

  /**
  * Create this shader into the attached rendering context.
  *
  * @return {GLShader} This instance for chaining purposes.
  */
  create () {
    if (this._shader == null) {
      const context = this.context.context

      const result = context.createShader(
        contextualiseShaderType(context, this.descriptor.type)
      )

      this._shader = result
      this.source = this.descriptor.source
    }

    return this
  }

  /**
  * @return {WebGLShader} The underlying WebGLShader reference.
  */
  get shader () {
    return this._shader
  }

  /**
  * Return the source code of this shader.
  *
  * @return {string} The source code of this shader.
  */
  get source () {
    return this._source
  }

  /**
  * Update the source code of this shader.
  *
  * @param {string} value - The new source code of this shader.
  */
  set source (value) {
    this._source = value
    this._compiled = false

    if (value) this.context.context.shaderSource(this._shader, value)

    for (const program of this.programs()) {
      program.unlink()
    }
  }

  /**
  * @return {any} The shader type constant (VERTEX_SHADER or FRAGMENT_SHADER).
  */
  get type () {
    const context = this.context.context
    return context.getShaderParameter(this._shader, context.SHADER_TYPE)
  }

  /**
  * @return {boolean} True if the shader was compiled.
  */
  get compiled () {
    return this._compiled
  }

  /**
  * @return {boolean} True if the shader was created.
  */
  get created () {
    return this._shader != null
  }

  /**
  * @return {string} Return the logs of this shader.
  */
  get logs () {
    return this.context.context.getShaderInfoLog(this._shader)
  }

  /**
  * Iterate over all programs this shader is attached to.
  *
  * @return {Iterator<GLProgram>} An iterator over all programs this shader is attached to.
  */
  * programs () {
    yield * this._programs
  }

  /**
  * Attach this contextualised shader to a contextualised program.
  *
  * @param {GLProgram} program - A program to attach.
  *
  * @throws {InvalidParameterError} If the given program is not from the same context.
  * @throws {InvalidParameterError} If the given program does not declare this shader as its vertex or fragment shader.
  */
  attach (program) {
    if (this._programs.has(program)) return

    if (program.context == this.context) {
      if (program.vertex == this || program.fragment == this) {
        this._programs.add(program)
        this.context.context.attachShader(program.program, this.shader)
      } else {
        throw new Error([
            'Unable to attach this shader to the given program because the ',
            'given program does not declare this shader as its fragment or ',
            'vertex shader.'
        ].join(''))
      }
    } else {
      throw new Error([
        'Unable to attach this shader to the given program because the ',
        'given program is not attached to the same context as this shader.'
      ].join(''))
    }
  }

  /**
  * Detach this contextualised shader from the given program.
  *
  * @param {GLProgram} program - A program to detach.
  */
  detach (program) {
    if (!this._programs.has(program)) return

    this._programs.delete(program)
    this.context.context.detachShader(program.program, this.shader)
  }

  /**
  * Compile this shader.
  *
  * If this shader was already compiled, this method will do nothing.
  *
  * @throws {ShaderCompilationError} When the compilation of the shader fail.
  */
  compile () {
    if (this._shader == null) this.create()
    if (this._source == null) throw new Error([
      'Unable to compile this shader because it currently have no sources to ',
      'compile.'
    ].join(''))

    if (!this._compiled) {
      const context = this.context.context
      const shader = this._shader

      context.compileShader(shader)

      if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        throw new ShaderCompilationError(this)
      }

      this._compiled = true
    }
  }

  /**
  * Destroy this shader.
  */
  destroy () {
    for (program of this._programs) {
      program.destroy()
    }

    if (this._shader != null) {
      this.context.context.deleteShader(this._shader)
      this._shader = null
    }

    super.destroy()
  }
}
