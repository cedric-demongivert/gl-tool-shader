import { Descriptor } from '@cedric-demongivert/gl-tool-core'
import { GLShader } from './GLShader'
import { VERTEX_SHADER, FRAGMENT_SHADER } from './ShaderType'

/**
* A webgl shader.
*/
export class Shader extends Descriptor {
  /**
  * Create a new webgl shader from source code.
  *
  * @param {string} source - Source code of the shader to create.
  * @param {ShaderType} type - Type shader to create.
  */
  constructor (source, type) {
    super()
    this._source = source
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
  * Return the type of this shader.
  *
  * @return {ShaderType} The type of this shader.
  */
  get type () {
    return this._type
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
  * Create a new vertex shader instance from some source code.
  *
  * @param {string} source - Source code of the shader to create.
  */
  constructor (source) {
    super(source, VERTEX_SHADER)
  }
}

/**
* A webgl fragment shader.
*/
export class FragmentShader extends Shader {
  /**
  * Create a new fragment shader instance from some source code.
  *
  * @param {string} source - Source code of the shader to create.
  */
  constructor (source) {
    super(source, FRAGMENT_SHADER)
  }
}

Shader.Vertex = VertexShader
Shader.Fragment = FragmentShader
