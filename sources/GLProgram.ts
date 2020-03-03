import { GLContextualisation } from '@cedric-demongivert/gl-tool-core'
import { GLContext } from '@cedric-demongivert/gl-tool-core'

import { ProgramLinkingError } from './ProgramLinkingError'
import { GLShader } from './GLShader'
import { GLUniforms } from './GLUniforms'
import { GLAttributes } from './GLAttributes'
import { ProgramParameter } from './ProgramParameter'

import { Program } from './Program'

/**
* A wrapper over a WebGLProgram
*/
export class GLProgram extends GLContextualisation<Program> {
  public vertex              : GLShader
  public fragment            : GLShader
  public program             : WebGLProgram
  public linked              : boolean
  public readonly uniforms   : GLUniforms
  public readonly attributes : GLAttributes

  /**
  * Create a new contextualisation of a webgl program descriptor.
  *
  * @param descriptor - A webgl program descriptor.
  * @param context - Context to attach.
  */
  public constructor (descriptor : Program, context : GLContext) {
    super(descriptor, context)

    this.program    = this.webgl.createProgram()
    this.vertex     = null
    this.fragment   = null
    this.linked     = false
    this.uniforms   = new GLUniforms(this)
    this.attributes = new GLAttributes(this)
  }

  /**
  * @return Program info log.
  */
  public get logs () : string {
    return this.webgl.getProgramInfoLog(this.program)
  }

  /**
  * @return True if this program is currently used.
  */
  public get used () : boolean {
    return this.webgl.getParameter(this.webgl.CURRENT_PROGRAM) === this.program
  }

  /**
  * Link this program.
  *
  * It will compile the attached vertex and fragment shader if they are not
  * compiled yet.
  *
  * @throws When the link operation fail.
  */
  public link () {
    if (this.vertex == null) {
      throw new Error(
        'Unable to link this program because it do not have a vertex shader.'
      )
    }

    if (this.fragment == null) {
      throw new Error(
        'Unable to link this program because it do not have a fragment shader.'
      )
    }

    if (!this.linked) {
      this.vertex.compile()
      this.fragment.compile()

      const webgl   : WebGLRenderingContext = this.webgl
      const program : WebGLProgram          = this.program

      webgl.linkProgram(program)

      if (!webgl.getProgramParameter(program, ProgramParameter.LINK_STATUS)) {
        throw new ProgramLinkingError(this)
      }

      this.linked = true
      this.uniforms.update()
      this.attributes.update()
    }
  }

  /**
  * Use this program for the next rendering operation.
  */
  public use () : void {
    if (!this.linked) {
      this.link()
    }

    this.webgl.useProgram(this.program)
  }

  /**
  * Synchronize this program instance with its descriptor.
  */
  public synchronize () : void {
    this.linked = false

    if (this.vertex) {
      this.vertex.detach(this)
    }

    if (this.fragment) {
      this.fragment.detach(this)
    }

    if (this.descriptor.vertex) {
      this.vertex = this.context.contextualisation(this.descriptor.vertex) as GLShader
      this.vertex.attach(this)
    } else {
      this.vertex = null
    }

    if (this.descriptor.fragment) {
      this.fragment = this.context.contextualisation(this.descriptor.fragment) as GLShader
      this.fragment.attach(this)
    } else {
      this.fragment = null
    }
  }

  /**
  * @see GLContextualisation.destroy
  */
  public destroy () : void {
    if (this.vertex) {
      this.vertex.detach(this)
      this.vertex = null
    }

    if (this.fragment) {
      this.fragment.detach(this)
      this.fragment = null
    }

    this.webgl.deleteProgram(this.program)
    this.program = null

    super.destroy()
  }
}
