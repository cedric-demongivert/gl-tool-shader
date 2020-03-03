import { Descriptor } from '@cedric-demongivert/gl-tool-core'
import { ShaderType } from './ShaderType'
import { Shader } from './Shader'

export class Program implements Descriptor {
  /**
  * Vertex shader associated to this program.
  */
  private _vertex   : Shader

  /**
  * Fragment shader associated to this program.
  */
  private _fragment : Shader

  /**
  * Create a new program.
  */
  public constructor () {
    this._vertex = null
    this._fragment = null
  }

  /**
  * Return the vertex shader attached to this program.
  *
  * @return The vertex shader attached to this program.
  */
  public get vertex () : Shader {
    return this._vertex
  }

  /**
  * Change the vertex shader of this program.
  *
  * @param {Shader} shader - The new vertex shader to attach.
  */
  public set vertex (shader : Shader) {
    if (shader && shader.type !== ShaderType.VERTEX_SHADER) {
      throw new Error(
        'Unable to attach the given shader as a vertex shader of this ' +
        'program because this shader was not a vertex shader.'
      )
    }

    this._vertex = shader
  }

  /**
  * Return the fragment shader attached to this program.
  *
  * @return The fragment shader attached to this program.
  */
  public get fragment () : Shader {
    return this._fragment
  }

  /**
  * Change the fragment shader attached to this program.
  *
  * @param shader - The fragment shader to attach to this program.
  */
  public set fragment (shader : Shader) {
    if (shader && shader.type !== ShaderType.FRAGMENT_SHADER) {
      throw new Error(
        'Unable to attach the given shader as a fragment shader of this ' +
        'program because this shader was not a fragment shader.'
      )
    }

    this._fragment = shader
  }
}
