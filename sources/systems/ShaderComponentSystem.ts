import { System } from '@cedric-demongivert/gl-tool-ecs'
import { Component } from '@cedric-demongivert/gl-tool-ecs'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { ShaderType } from '../ShaderType'
import { ShaderSource } from '../ShaderSource'
import { ShaderIdentifier } from '../ShaderIdentifier'

import { Shader } from '../components/Shader'
import { ShaderComponentType } from '../types/ShaderComponentType'

import { ShaderCollection } from './ShaderCollection'

export class ShaderComponentSystem extends System {
  /**
  * A set of all existing shaders.
  */
  public readonly shaderCollection : ShaderCollection

  /**
  * A sequence of shader identifier by entity.
  */
  private readonly _entityShaders : Pack<ShaderIdentifier>

  /**
  * A sequence of shader identifier by entity.
  */
  private readonly _shadersComponents : Pack<number>

  /**
  * Instantiate a new empty shading component system.
  *
  * @param ShaderSystem - The underlying shader manager.
  */
  public constructor (collection : ShaderCollection) {
    super()

    this.shaderCollection = collection
    this._entityShaders = Pack.uint32(0)
    this._shadersComponents = Pack.uint32(collection.capacity)
  }

  /**
  * @see System.initialize
  */
  public initialize () : void {
    this._entityShaders.reallocate(this.manager.capacity.entities)

    for (const entity of this.manager.getEntitiesWithType(ShaderComponentType)) {
      this.onShaderComponentAddition(
        this.manager.getComponentOfEntity(entity, ShaderComponentType)
      )
    }
  }

  /**
  * @see System.managerDidAddComponent
  */
  public managerDidAddComponent (component : Component<any>) : void {
    if (component.type === ShaderComponentType) {
      this.onShaderComponentAddition(component)
    }
  }

  /**
  * Called when a new shader component was discovered.
  *
  * @param component - The discovered component.
  */
  public onShaderComponentAddition (component : Component<Shader>) : void {
    const shader : Shader = component.data

    shader.identifier = this.shaderCollection.create(shader.identifier, shader.type)
    this.shaderCollection.setSource(shader.identifier, shader.source)

    this._shadersComponents.set(shader.identifier, component.identifier)
    this._entityShaders.set(component.entity, shader.identifier)
  }

  /**
  * Called when a shader component was updated.
  *
  * @param component - The component to commit.
  */
  public commit (component : Component<Shader>) : void {
    const shader : Shader = component.data
    const oldIdentifier : number = this._entityShaders.get(component.entity)
    const oldType : ShaderType = this.shaderCollection.getType(oldIdentifier)
    const oldSource : ShaderSource = this.shaderCollection.getSource(oldIdentifier)

    if (oldIdentifier !== shader.identifier) {
      this.shaderCollection.delete(oldIdentifier)
      this.onShaderComponentAddition(component)
    } else if (oldType !== shader.type) {
      this.shaderCollection.delete(shader.identifier)
      this.shaderCollection.create(shader.identifier, shader.type)
      this.shaderCollection.setSource(shader.identifier, shader.source)
    } else if (oldSource.timestamp !== shader.source.timestamp) {
      this.shaderCollection.setSource(shader.identifier, shader.source)
    }
  }

  /**
  * @see System.managerWillDeleteComponent
  */
  public managerWillDeleteComponent (component : Component<any>) : void {
    if (component.type === ShaderComponentType) {
      this.onShaderComponentDeletion(component)
    }
  }

  /**
  * Called when a new shader component will be deleted.
  *
  * @param component - The component that will be deleted.
  */
  public onShaderComponentDeletion (component : Component<Shader>) : void {
    this.shaderCollection.delete(component.data.identifier)
  }

  /**
  * @see System.destroy
  */
  public destroy () : void {
    for (const entity of this.manager.getEntitiesWithType(ShaderComponentType)) {
      this.onShaderComponentDeletion(
        this.manager.getComponentOfEntity(entity, ShaderComponentType)
      )
    }
  }

  /**
  * Return the component related to the shader with the given identifier.
  *
  * @param identifier - Identifier of the shader to search.
  *
  * @return The component related to the shader with the given identifier.
  */
  public getComponent (identifier : ShaderIdentifier) : Component<Shader> {
    return this.manager.getComponent(this._shadersComponents.get(identifier))
  }
}
