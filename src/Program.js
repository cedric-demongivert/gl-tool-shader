import {
  Descriptor,
  GLContextualisation
} from '@cedric-demongivert/gl-tool-core'

import { GLProgram } from './GLProgram'
import { VERTEX_SHADER, FRAGMENT_SHADER } from './ShaderType'

export class Program extends Descriptor {
  /**
  * Create a new shader program.
  */
  constructor () {
    super()

    this._vertex = null
    this._fragment = null
  }

  /**
  * Return the vertex shader attached to this program.
  *
  * @return {Shader} The vertex shader attached to this program.
  */
  get vertex () {
    return this._vertex
  }

  /**
  * Change the vertex shader of this program.
  *
  * @param {Shader} shader - The new vertex shader to attach.
  */
  set vertex (shader) {
    if (shader && shader.type !== VERTEX_SHADER) throw new Error([
      'Unable to attach the given shader as a vertex shader of this program ',
      'because this shader was not a vertex shader.'
    ].join(''))

    this._vertex = shader
  }

  /**
  * Return the fragment shader attached to this program.
  *
  * @return {Shader} The fragment shader attached to this program.
  */
  get fragment () {
    return this._fragment
  }

  /**
  * Change the fragment shader attached to this program.
  *
  * @param {Shader} shader - The fragment shader to attach to this program.
  */
  set fragment (shader) {
    if (shader && shader.type !== FRAGMENT_SHADER) throw new Error([
      'Unable to attach the given shader as a vertex shader of this program ',
      'because this shader was not a vertex shader.'
    ].join(''))

    this._fragment = shader
  }

  /**
  * Commit this program content to its contextualised instances.
  */
  commit () {
    for (const contextualisation of GLContextualisation.all(this)) {
      contextualisation.synchronize()
    }
  }

  /**
  * @see Descriptor#contextualise
  */
  contextualise (context) {
    return new GLProgram(context, this)
  }
}
