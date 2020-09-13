import { ComponentType } from '@cedric-demongivert/gl-tool-ecs'

import { Program } from '../components/Program'

export const ProgramComponentType : ComponentType<Program> = {
  /**
  * @see OverseerComponentType.instantiate
  */
  instantiate () : Program {
    return new Program()
  },

  /**
  * @see OverseerComponentType.copy
  */
  copy (origin : Program, target : Program) : void {
    target.copy(origin)
  },

  /**
  * @see OverseerComponentType.clear
  */
  clear (instance : Program) : void {
    instance.clear()
  }
}
