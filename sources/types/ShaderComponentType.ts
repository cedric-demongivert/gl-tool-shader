import { ComponentType } from '@cedric-demongivert/gl-tool-ecs'

import { Shader } from '../components/Shader'

export const ShaderComponentType : ComponentType<Shader> = {
  /**
  * @see OverseerComponentType.instantiate
  */
  instantiate () : Shader {
    return new Shader()
  },

  /**
  * @see OverseerComponentType.copy
  */
  copy (origin : Shader, target : Shader) : void {
    target.copy(origin)
  },

  /**
  * @see OverseerComponentType.clear
  */
  clear (instance : Shader) : void {
    instance.clear()
  }
}
