import { Descriptor } from '@cedric-demongivert/gl-tool-core'
import { GLProgram } from './GLProgram'
import { VERTEX_SHADER, FRAGMENT_SHADER } from './ShaderType'

export class Program extends Descriptor {
  /**
  * Create a new shader program.
  *
  * @param {Shader} vertex - The vertex shader to attach to this program.
  * @param {Shader} fragment - The fragment shader to attach to this program.
  */
  constructor (vertex, fragment) {
    super()
    
    if (vertex.type !== VERTEX_SHADER) throw new Error([
      'Unable to create the program because the given vertex shader ',
      'was not a vertex shader.'
    ].join(''))

    if (fragment.type !== FRAGMENT_SHADER) throw new Error([
      'Unable to create the program because the given fragment shader ',
      'was not a fragment shader.'
    ].join(''))

    this._vertex = vertex
    this._fragment = fragment
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
  * Return the fragment shader attached to this program.
  *
  * @return {Shader} The fragment shader attached to this program.
  */
  get fragment () {
    return this._fragment
  }

  /**
  * @see Descriptor#contextualise
  */
  contextualise (context) {
    return new GLProgram(context, this)
  }
}
