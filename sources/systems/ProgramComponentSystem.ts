import { System } from '@cedric-demongivert/gl-tool-ecs'
import { Component } from '@cedric-demongivert/gl-tool-ecs'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { ProgramIdentifier } from '../ProgramIdentifier'
import { Program } from '../components/Program'
import { ProgramComponentType } from '../types/ProgramComponentType'

import { ProgramCollection } from './ProgramCollection'

export class ProgramComponentSystem extends System {
  /**
  * A set of all existing programs.
  */
  public readonly programs : ProgramCollection

  /**
  * A sequence of program identifier by entity.
  */
  private readonly _entityPrograms : Pack<ProgramIdentifier>

  /**
  * A sequence of component identifier by program.
  */
  private readonly _programComponents : Pack<number>

  /**
  * Instantiate a new empty program component system.
  *
  * @param programs - The underlying program manager.
  */
  public constructor (programs : ProgramCollection) {
    super()

    this.programs = programs
    this._entityPrograms = Pack.uint32(0)
    this._programComponents = Pack.uint32(programs.capacity)
  }

  /**
  * @see System.initialize
  */
  public initialize () : void {
    this._entityPrograms.reallocate(this.manager.capacity.entities)

    for (const entity of this.manager.getEntitiesWithType(ProgramComponentType)) {
      this.onProgramComponentAddition(
        this.manager.getComponentOfEntity(entity, ProgramComponentType)
      )
    }
  }

  /**
  * @see System.managerDidAddComponent
  */
  public managerDidAddComponent (component : Component<any>) : void {
    if (component.type === ProgramComponentType) {
      this.onProgramComponentAddition(component)
    }
  }

  public onProgramComponentAddition (component : Component<Program>) : void {
    const program : Program = component.data

    program.identifier = this.programs.create(program.identifier)

    this.programs.setVertexShader(
      program.identifier,
      program.getVertexShaderIdentifier()
    )

    this.programs.setFragmentShader(
      program.identifier,
      program.getFragmentShaderIdentifier()
    )

    this._entityPrograms.set(component.entity, program.identifier)
    this._programComponents.set(program.identifier, component.identifier)
  }

  /**
  * Called when a program component was updated.
  *
  * @param component - The component to commit.
  */
  public commit (component : Component<Program>) : void {
    const program : Program = component.data
    const oldIdentifier : number = this._entityPrograms.get(component.entity)
    const oldVertex : number = this.programs.getVertexShader(oldIdentifier)
    const oldFragment : number = this.programs.getFragmentShader(oldIdentifier)

    if (oldIdentifier !== program.identifier) {
      this.programs.delete(oldIdentifier)
      this.onProgramComponentAddition(component)
    } else {
      if (oldVertex !== program.getVertexShaderIdentifier()) {
        this.programs.setVertexShader(
          program.identifier,
          program.getVertexShaderIdentifier()
        )
      }

      if (oldFragment !== program.getFragmentShaderIdentifier()) {
        this.programs.setFragmentShader(
          program.identifier,
          program.getFragmentShaderIdentifier()
        )
      }
    }
  }

  /**
  * @see System.managerWillDeleteComponent
  */
  public managerWillDeleteComponent (component : Component<any>) : void {
    if (component.type === ProgramComponentType) {
      this.onProgramComponentDeletion(component)
    }
  }

  /**
  * Called when a program component will be deleted.
  *
  * @param component - The component that will be deleted.
  */
  public onProgramComponentDeletion (component : Component<Program>) : void {
    this.programs.delete(component.data.identifier)
  }

  /**
  * @see System.destroy
  */
  public destroy () : void {
    for (const entity of this.manager.getEntitiesWithType(ProgramComponentType)) {
      this.onProgramComponentDeletion(
        this.manager.getComponentOfEntity(entity, ProgramComponentType)
      )
    }

    this._entityPrograms.reallocate(0)
  }

  /**
  * Return the component related to the program with the given identifier.
  *
  * @param identifier - Identifier of the program to search.
  *
  * @return The component related to the program with the given identifier.
  */
  public getComponent (identifier : ProgramIdentifier) : Component<Program> {
    return this.manager.getComponent(this._programComponents.get(identifier))
  }
}
