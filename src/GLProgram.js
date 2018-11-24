import { GLContextualisation } from '@cedric-demongivert/gl-tool-core'
import { ProgramLinkingError } from './ProgramLinkingError'
import { GLUniforms } from './GLUniforms'
import { GLAttributes } from './GLAttributes'

/**
* A wrapper over a WebGLProgram
*/
export class GLProgram extends GLContextualisation {
  /**
  * Create a new contextualisation of a webgl program descriptor.
  *
  * @param {GLContext|WebGLRenderingContext} context - Context to attach.
  * @param {Program} descriptor - A webgl program descriptor.
  */
  constructor (context, descriptor) {
    super(context, descriptor)

    this._program = null
    this._linked = false
    this._uniforms = new GLUniforms(this)
    this._attributes = new GLAttributes(this)
  }

  /**
  * Create the described webgl program into the related context.
  *
  * @return {GLProgram} The current instance for chaining purposes.
  */
  create () {
    if (this._program == null) {
      const context = this.context.context
      const descriptor = this.descriptor

      this._program = context.createProgram()

      if (!this.vertex.created) this.vertex.create()
      if (!this.fragment.created) this.fragment.create()

      this.vertex.attach(this)
      this.fragment.attach(this)
    }

    return this
  }

  /**
  * @return {WebGLProgram} The underlying WebGLProgram.
  */
  get program () {
    return this._program
  }

  /**
  * @return {GLUniforms} All meta information about each uniforms of this program.
  */
  get uniforms () {
    return this._uniforms
  }

  /**
  * @return {GLAttributes} All meta information about each attributes of this program.
  */
  get attributes () {
    return this._attributes
  }

  /**
  * @return {boolean} True if this program was created.
  */
  get created () {
    return this._program != null
  }

  /**
  * Return the current vertex shader used by this program.
  *
  * @return {GLShader} The vertex shader used by this program.
  */
  get vertex () {
    return GLContextualisation.of(this.context, this.descriptor.vertex)
  }

  /**
  * Return the current fragment shader used by this program.
  *
  * @return {GLShader} The fragment shader used by this program.
  */
  get fragment () {
    return GLContextualisation.of(this.context, this.descriptor.fragment)
  }

  /**
  * @return {boolean} True if this program is linked.
  */
  get linked () {
    return this._linked
  }

  /**
  * @return {string} Program info log.
  */
  get logs () {
    return this.context.context.getProgramInfoLog(this._program)
  }

  /**
  * @return {boolean} True if this program is currently used.
  */
  get used () {
    const context = this.context.context
    return context.getParameter(context.CURRENT_PROGRAM) === this._program
  }

  /**
  * Link this program.
  *
  * It will compile the attached vertex and fragment shader if they are not
  * compiled yet.
  *
  * @throws {ProgramLinkingError} When the link operation fail.
  *
  * @return {GLProgram} This program instance for chaining purpose.
  */
  link () {
    if (!this._created) this.create()

    if (!this._linked) {
      this.vertex.compile()
      this.fragment.compile()

      const context = this.context.context
      const program = this._program
      context.linkProgram(program)

      if (!context.getProgramParameter(program, context.LINK_STATUS)) {
        throw new ProgramLinkingError(this)
      }

      this._linked = true
      this._uniforms.update()
      this._attributes.update()
    }
  }

  /**
  * Use this program for the next rendering operation.
  */
  use () {
    if (!this._linked) this.link()
    this.context.context.useProgram(this._program)
  }

  /**
  * Destroy this program.
  */
  destroy () {
    if (this._program) {
      if (this._program != null) {
        this.vertex.detach(this)
        this.fragment.detach(this)
        this.context.context.deleteProgram(this._program)
        this._program = null
      }

      super.destroy()
    }
  }
}
