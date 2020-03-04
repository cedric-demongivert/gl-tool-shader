import { GLContextualisation } from '@cedric-demongivert/gl-tool-core'
import { GLContext } from '@cedric-demongivert/gl-tool-core'

import { GLProgram } from './GLProgram'
import { ShaderParameter } from './ShaderParameter'
import { ShaderCompilationError } from './ShaderCompilationError'
import { Shader } from './Shader'

/**
* A webgl shader bound to a rendering context.
*/
export class GLShader extends GLContextualisation<Shader> {
  /**
  * Programs that use this shader.
  */
  public readonly programs : Set<GLProgram>

  /**
  * The current compiled source.
  */
  public source : string

  /**
  * The related Webgl Shader.
  */
  public shader : WebGLShader

  /**
  * True if this shader was compiled.
  */
  public compiled : boolean

  /**
  * Create a new webgl shader from a shader description instance and a rendering context.
  *
  * @param context - The webgl rendering context of this instance.
  * @param shader - The shader descriptor to contextualise.
  */
  public constructor (shader : Shader, context : GLContext) {
    super(shader, context)

    const webgl : WebGLRenderingContext = this.webgl

    this.shader = webgl.createShader(this.descriptor.type)
    this.source = this.descriptor.source
    this.programs = new Set<GLProgram>()
    this.compiled = false

    webgl.shaderSource(this.shader, this.source)
  }

  /**
  * @return Return the logs of this shader.
  */
  public get logs () : string {
    return this.webgl.getShaderInfoLog(this.shader)
  }

  /**
  * Attach this shader to a program.
  *
  * @param program - A program to attach.
  *
  * @throws If the given program is not from the same context.
  * @throws If the given program does not declare this shader as its vertex or fragment shader.
  */
  public attach (program : GLProgram) : void {
    if (this.programs.has(program)) return

    if (program.context === this.context) {
      if (program.vertex === this || program.fragment === this) {
        this.programs.add(program)
        this.webgl.attachShader(program.program, this.shader)
      } else {
        throw new Error(
          'Unable to attach this shader to the given program because the ' +
          'given program does not declare this shader as its fragment or ' +
          'vertex shader.'
        )
      }
    } else {
      throw new Error(
        'Unable to attach this shader to the given program because the ' +
        'given program is not attached to the same context as this shader.'
      )
    }
  }

  /**
  * Detach this shader from the given program.
  *
  * @param program - A program to detach.
  */
  public detach (program : GLProgram) : void {
    if (!this.programs.has(program)) return

    this.programs.delete(program)
    this.webgl.detachShader(program.program, this.shader)
  }

  /**
  * Compile this shader.
  *
  * If this shader was already compiled, this method will do nothing.
  *
  * @throws When the compilation of the shader fail.
  */
  public compile () {
    if (this.source == null) throw new Error(
      'Unable to compile this shader because it currently have no sources to ' +
      'compile.'
    )

    if (!this.compiled) {
      const webgl  : WebGLRenderingContext = this.webgl
      const shader : WebGLShader           = this.shader

      webgl.compileShader(shader)

      if (!webgl.getShaderParameter(shader, ShaderParameter.COMPILE_STATUS)) {
        throw new ShaderCompilationError(this)
      }

      this.compiled = true
    }
  }

  /**
  * Destroy this shader.
  */
  public destroy () {
    for (const program of this.programs) {
      program.linked = false
      this.detach(program)
    }

    this.webgl.deleteShader(this.shader)
    this.shader = null

    super.destroy()
  }
}
