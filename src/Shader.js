import {
  Descriptor,
  GLContextualisation
} from '@cedric-demongivert/gl-tool-core'
import { GLShader } from './GLShader'
import { VERTEX_SHADER, FRAGMENT_SHADER } from './ShaderType'

/**
* A webgl shader.
*/
export class Shader extends Descriptor {
  /**
  * Create a new webgl shader.
  *
  * @param {ShaderType} type - Type shader to create.
  */
  constructor (type) {
    super()
    this._source = null
    this._type = type
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
  * @param {string} source - The new source code of this shader.
  */
  set source (source) {
    this._source = source
  }

  /**
  * Return the type of this shader.
  *
  * @return {ShaderType} The type of this shader.
  */
  get type () {
    return this._type
  }

  /**
  * Commit this shader content to its contextualised instances.
  */
  commit () {
    for (const contextualisation of GLContextualisation.all(this)) {
      contextualisation.source = this._source
    }
  }

  /**
  * @see Descriptor#contextualise
  */
  contextualise (context) {
    return new GLShader(context, this)
  }
}

/**
* A webgl vertex shader.
*/
export class VertexShader extends Shader {
  /**
  * Create a new vertex shader instance.
  */
  constructor () {
    super(VERTEX_SHADER)
  }
}

/**
* A webgl fragment shader.
*/
export class FragmentShader extends Shader {
  /**
  * Create a new fragment shader instance.
  */
  constructor () {
    super(FRAGMENT_SHADER)
  }
}

Shader.Vertex = VertexShader
Shader.Fragment = FragmentShader
