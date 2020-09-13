import { System } from '@cedric-demongivert/gl-tool-ecs'
import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { ShaderType } from '../ShaderType'
import { ShaderSource } from '../ShaderSource'

import { ShaderCollectionListener } from './ShaderCollectionListener'

export class ShaderCollection extends System {
  /**
  * A view over the underlying set of all existing shaders.
  */
  public readonly shaders : Sequence<number>

  /**
  * The maximum number of shader that can be stored into this collection.
  */
  public readonly capacity : number

  /**
  * A set of all existing shaders.
  */
  private readonly _shaders : IdentifierSet

  /**
  * A sequence of types of shader indexed by shader identifier.
  */
  private readonly _types : Pack<ShaderType>

  /**
  * A sequence of sources of shader indexed by shader identifier.
  */
  private readonly _sources : Pack<ShaderSource>

  /**
  * A set of all shader collection listener.
  */
  private readonly _listeners : Set<ShaderCollectionListener>

  /**
  * Instantiate a new empty shading system.
  *
  * @param [shaderCapacity = 256] - Capacity to allocate for indexing all shaders of this system.
  */
  public constructor (capacity : number = 256) {
    super()

    this._shaders = IdentifierSet.allocate(capacity)
    this._types = Pack.uint8(capacity)
    this._sources = Pack.instance(ShaderSource.ALLOCATOR, capacity)

    this.shaders = this._shaders.view()
    this._listeners = new Set()
    this.capacity = capacity
  }

  /**
  * Register an existing shading collection listener.
  *
  * @param listener - A listener to register.
  */
  public addListener (listener : ShaderCollectionListener) : void {
    this._listeners.add(listener)

    listener.afterSubscription(this)

    for (const shader of this._shaders) {
      listener.afterShaderCreation(shader)
    }
  }

  /**
  * Remove a previously registered shading collection listener.
  *
  * @param listener - A listener to remove.
  */
  public deleteListener (driver : ShaderCollectionListener) : void {
    for (const shader of this._shaders) {
      driver.beforeShaderDeletion(shader)
    }

    driver.beforeUnsubscription(this)

    this._listeners.delete(driver)
  }

  /**
  * @see System.initialize
  */
  public initialize () : void {

  }

  /**
  * Declare a new shader into this collection.
  *
  * @param type - The type of shader to allocate.
  *
  * @return The identifier of the shader that was allocated.
  */
  public create (type : number) : number
  /**
  * Declare a new shader into this collection.
  *
  * @param identifier - Identifier of the shader to declare.
  * @param type - The type of shader to allocate.
  *
  * @return The identifier of the shader that was allocated.
  */
  public create (identifier : number, type : ShaderType) : number
  public create (...parameters : number[]) : number {
    let identifier : number, type : ShaderType

    if (parameters.length < 2) {
      identifier = this._shaders.next()
      type = parameters[0]
    } else {
      identifier = parameters[0]
      type = parameters[1]

      if (this._shaders.has(identifier)) {
        throw new Error(
          'Unable to create shader #' + identifier + ' of type ' +
          ShaderType.toString(identifier) + ' because this shader was ' +
          'already created.'
        )
      }
    }

    this._types.set(identifier, type)
    this._sources.get(identifier).clear()

    for (const listener of this._listeners) {
      listener.afterShaderCreation(identifier)
    }

    return identifier
  }

  /**
  * Update the source of an existing shader.
  *
  * @param identifier - Identifier of the shader to update.
  * @param source - The new source of the shader.
  */
  public setSource (identifier : number, source : ShaderSource) : void {
    if (!this._shaders.has(identifier)) {
      throw new Error(
        'Unable to update shader #' + identifier + ' because there is ' +
        'no shader with the given identifier into this system.'
      )
    }

    this._sources.get(identifier).copy(source)

    for (const listener of this._listeners) {
      listener.afterSourceUpdate(identifier)
    }
  }

  /**
  * Remove a shader from this shading system.
  *
  * @param identifier - Identifier of the shader to delete.
  */
  public delete (identifier : number) : void {
    if (!this._shaders.has(identifier)) {
      throw new Error(
        'Unable to delete shader #' + identifier + ' because there is ' +
        'no shader with the given identifier into this system.'
      )
    }

    for (const listener of this._listeners) {
      listener.beforeShaderDeletion(identifier)
    }

    this._shaders.delete(identifier)
  }

  /**
  * @see System.destroy
  */
  public destroy () : void {
    while (this._shaders.size > 0) {
      this.delete(this._shaders.last)
    }

    while (this._listeners.size > 0) {
      this.deleteListener(this._listeners.values().next().value)
    }
  }

  /**
  * Return the source attached to the given shader.
  *
  * @param identifier - Identifier of the shader to search.
  *
  * @return The source attached to the given shader.
  */
  public getSource (identifier : number) : ShaderSource {
    return this._sources.get(identifier)
  }

  /**
  * Return the type of the given shader.
  *
  * @param identifier - Identifier of the shader to search.
  *
  * @return The type attached of the given shader.
  */
  public getType (identifier : number) : ShaderType {
    return this._types.get(identifier)
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false

    return other === this
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    let result : string = ''
    let first : boolean = true

    result += 'ShaderCollection ['
    for (const shader of this._shaders) {
      if (first) {
        first = false
      } else {
        result += ', '
      }

      result += shader
    }
    result += ']'

    return result
  }
}
