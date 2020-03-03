import { Descriptor } from '@cedric-demongivert/gl-tool-core'

import { ShaderType } from './ShaderType'

/**
* A webgl shader.
*/
export class Shader implements Descriptor {
  /**
  * Type of this shader.
  */
  public readonly type : ShaderType

  /**
  * Source code associated to this shader.
  */
  public source : string

  /**
  * Create a new shader.
  *
  * @param type - Type of shader to create.
  */
  public constructor (type : ShaderType) {
    this.source = null
    this.type   = type
  }
}

export namespace Shader {
  /**
  * @return A new fragment shader.
  */
  export function fragment () : Shader {
    return new Shader(ShaderType.FRAGMENT_SHADER)
  }

  /**
  * @return A new vertex shader.
  */
  export function vertex () : Shader {
    return new Shader(ShaderType.VERTEX_SHADER)
  }
}
