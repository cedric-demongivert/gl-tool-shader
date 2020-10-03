import { System } from '@cedric-demongivert/gl-tool-ecs'
import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { ShaderType } from '../ShaderType'
import { ShaderIdentifier } from '../ShaderIdentifier'
import { ProgramIdentifier } from '../ProgramIdentifier'

import { ProgramCollectionListener } from './ProgramCollectionListener'
import { ShaderCollection } from './ShaderCollection'
import { ShaderCollectionListener } from './ShaderCollectionListener'

export class ProgramCollection extends System implements ShaderCollectionListener {
  /**
  * A view over the underlying set of all existing programs.
  */
  public readonly programs : Sequence<ProgramIdentifier>

  /**
  * The capacity of this program system.
  */
  public readonly capacity : number

  /**
  * A set of all existing programs.
  */
  public readonly _programs : IdentifierSet

  /**
  * A sequence of vertex shader identifier by program identifier.
  */
  private readonly _programVertexShaders : Pack<ShaderIdentifier>

  /**
  * A sequence of fragment shader identifier by program identifier.
  */
  private readonly _programFragmentShaders : Pack<ShaderIdentifier>

  /**
  * A set of all existing program system drivers.
  */
  private readonly _listeners : Set<ProgramCollectionListener>

  /**
  * The parent shader collection.
  */
  private _shaders : ShaderCollection

  /**
  * Instantiate a new empty program system.
  *
  * @param [capacity = 256] - Capacity to allocate for indexing all programs of this system.
  */
  public constructor (capacity : number = 256) {
    super()

    this._programs = IdentifierSet.allocate(capacity)
    this._programVertexShaders = Pack.uint32(capacity)
    this._programFragmentShaders = Pack.uint32(capacity)
    this._listeners = new Set()
    this._shaders = null

    this.programs = this._programs.view()
    this.capacity = capacity
  }

  /**
  * @see ShaderCollectionListener.shaders
  */
  public afterSubscription (collection : ShaderCollection) : void {
    if (this._shaders == null) {
      this._shaders = collection
    } else {
      throw new Error(
        'Unable to subscribe this ProgramCollection to the given ' +
        'ShaderCollection because this ProgramCollection was already ' +
        'registered into another ShaderCollection instance.'
      )
    }
  }

  /**
  * @see ShaderCollectionListener.shaders
  */
  public beforeUnsubscription (collection : ShaderCollection) : void {
    if (this._shaders === collection) {

      for (const program of this._programs) {
        this._programVertexShaders.set(program, Number.MAX_SAFE_INTEGER)
        this._programFragmentShaders.set(program, Number.MAX_SAFE_INTEGER)

        for (const listener of this._listeners) {
          listener.afterProgramUpdate(program)
        }
      }

      this._shaders = null
    } else {
      throw new Error(
        'Unable to unsubscribe this ProgramCollection from the given ' +
        'ShaderCollection because this ProgramCollection was registered ' +
        'into another ShaderCollection instance.'
      )
    }
  }

  public afterShaderCreation (shader : ShaderIdentifier) : void {

  }

  public afterSourceUpdate (shader : ShaderIdentifier) : void {
    switch (this._shaders.getType(shader)) {
      case ShaderType.FRAGMENT:
        return this.afterFragmentShaderSourceUpdate(shader)
      case ShaderType.VERTEX:
        return this.afterVertexShaderSourceUpdate(shader)
      default:
        return
    }
  }

  private afterFragmentShaderSourceUpdate (shader : ShaderIdentifier) : void {
    for (const program of this._programs) {
      if (this._programFragmentShaders.get(program) === shader) {
        for (const listener of this._listeners) {
          listener.afterProgramUpdate(program)
        }
      }
    }
  }

  private afterVertexShaderSourceUpdate (shader : ShaderIdentifier) : void {
    for (const program of this._programs) {
      if (this._programVertexShaders.get(program) === shader) {
        for (const listener of this._listeners) {
          listener.afterProgramUpdate(program)
        }
      }
    }
  }

  public beforeShaderDeletion (shader : ShaderIdentifier) : void {
    switch (this._shaders.getType(shader)) {
      case ShaderType.FRAGMENT:
        return this.beforeFragmentShaderDeletion(shader)
      case ShaderType.VERTEX:
        return this.beforeVertexShaderDeletion(shader)
      default:
        return
    }
  }

  private beforeFragmentShaderDeletion (shader : ShaderIdentifier) : void {
    for (const program of this._programs) {
      if (this._programFragmentShaders.get(program) === shader){
        this._programFragmentShaders.set(program, Number.MAX_SAFE_INTEGER)

        for (const listener of this._listeners) {
          listener.afterProgramUpdate(program)
        }
      }
    }
  }

  private beforeVertexShaderDeletion (shader : ShaderIdentifier) : void {
    for (const program of this._programs) {
      if (this._programVertexShaders.get(program) === shader){
        this._programVertexShaders.set(program, Number.MAX_SAFE_INTEGER)

        for (const listener of this._listeners) {
          listener.afterProgramUpdate(program)
        }
      }
    }
  }

  /**
  * Register a listener.
  *
  * @param listener - The listener to register.
  */
  public addListener (listener : ProgramCollectionListener) : void {
    this._listeners.add(listener)

    listener.afterSubscription(this)

    for (const program of this._programs) {
      listener.afterProgramCreation(program)
    }
  }

  public hasFragmentShader (program : number) : boolean {
    return this._programFragmentShaders.get(program) !== Number.MAX_SAFE_INTEGER
  }

  public hasVertexShader (program : number) : boolean {
    return this._programVertexShaders.get(program) !== Number.MAX_SAFE_INTEGER
  }

  public isComplete (program : number) : boolean {
    return this._programVertexShaders.get(program) !== Number.MAX_SAFE_INTEGER &&
           this._programFragmentShaders.get(program) !== Number.MAX_SAFE_INTEGER
  }

  /**
  * Remove a previously registered listener.
  *
  * @param driver - A listener to remove.
  */
  public deleteListener (listener : ProgramCollectionListener) : void {
    for (const program of this._programs) {
      listener.beforeProgramDeletion(program)
    }

    listener.beforeUnsubscription(this)

    this._listeners.delete(listener)
  }

  /**
  * @see System.initialize
  */
  public initialize () : void {

  }

  /**
  * Declare a new program into this system.
  *
  * @return The identifier of the program that was allocated.
  */
  public create () : ProgramIdentifier
  /**
  * Declare a new program into this system.
  *
  * @param identifier - Identifier of the program to declare.
  *
  * @return The identifier of the program that was allocated.
  */
  public create (identifier : number) : ProgramIdentifier
  public create (identifier? : number) : ProgramIdentifier {
    let result : number

    if (identifier == null || identifier === ProgramIdentifier.UNDEFINED) {
      result = this._programs.next()
    } else if (this._programs.has(identifier)) {
      throw new Error(
        'Unable to create program #' + identifier + ' because this program ' +
        'was already created.'
      )
    } else {
      result = identifier
    }

    this._programVertexShaders.set(result, Number.MAX_SAFE_INTEGER)
    this._programFragmentShaders.set(result, Number.MAX_SAFE_INTEGER)

    for (const listener of this._listeners) {
      listener.afterProgramCreation(result)
    }

    return result
  }

  /**
  * Remove the vertex shader of an existing program.
  *
  * @param identifier - Identifier of the program to update.
  */
  public deleteVertexShader (identifier : ProgramIdentifier) : void {
    if (!this._programs.has(identifier)) {
      throw new Error(
        'Unable to update program #' + identifier + ' because there is ' +
        'no program with the given identifier into this system.'
      )
    }

    this._programVertexShaders.set(identifier, Number.MAX_SAFE_INTEGER)

    for (const listener of this._listeners) {
      listener.afterProgramUpdate(identifier)
    }
  }

  /**
  * Update the vertex shader of an existing program.
  *
  * @param identifier - Identifier of the program to update.
  * @param shader - The new vertex shader of the program.
  */
  public setVertexShader (identifier : ProgramIdentifier, shader : ShaderIdentifier) : void {
    if (!this._programs.has(identifier)) {
      throw new Error(
        'Unable to update program #' + identifier + ' because there is ' +
        'no program with the given identifier into this system.'
      )
    }

    if (this._shaders == null || !this._shaders.shaders.has(shader)) {
      throw new Error(
        'Unable to set the vertex shader of the program #' + identifier +
        'to #' + shader + ' because the given shader does not exists.'
      )
    }

    if (this._shaders.getType(shader) !== ShaderType.VERTEX) {
      throw new Error(
        'Unable to set the vertex shader of the program #' + identifier +
        'to #' + shader + ' because the given shader is not a vertex shader.'
      )
    }

    this._programVertexShaders.set(identifier, shader)

    for (const listener of this._listeners) {
      listener.afterProgramUpdate(identifier)
    }
  }

  /**
  * Update the fragment shader of an existing program.
  *
  * @param identifier - Identifier of the program to update.
  * @param shader - The new fragment shader of the program.
  */
  public setFragmentShader (identifier : ProgramIdentifier, shader : ShaderIdentifier) : void {
    if (!this._programs.has(identifier)) {
      throw new Error(
        'Unable to update program #' + identifier + ' because there is ' +
        'no program with the given identifier into this system.'
      )
    }

    if (this._shaders == null || !this._shaders.shaders.has(shader)) {
      throw new Error(
        'Unable to set the fragment shader of the program #' + identifier +
        'to #' + shader + ' because the given shader does not exists.'
      )
    }

    if (this._shaders.getType(shader) !== ShaderType.FRAGMENT) {
      throw new Error(
        'Unable to set the fragment shader of the program #' + identifier +
        'to #' + shader + ' because the given shader is not a fragment shader.'
      )
    }

    this._programFragmentShaders.set(identifier, shader)

    for (const listener of this._listeners) {
      listener.afterProgramUpdate(identifier)
    }
  }

  /**
  * Remove the fragment shader of an existing program.
  *
  * @param identifier - Identifier of the program to update.
  */
  public deleteFragmentShader (identifier : ProgramIdentifier) : void {
    if (!this._programs.has(identifier)) {
      throw new Error(
        'Unable to update program #' + identifier + ' because there is ' +
        'no program with the given identifier into this system.'
      )
    }

    this._programFragmentShaders.set(identifier, Number.MAX_SAFE_INTEGER)

    for (const listener of this._listeners) {
      listener.afterProgramUpdate(identifier)
    }
  }

  /**
  * Remove a program from this program system.
  *
  * @param identifier - Identifier of the program to delete.
  */
  public delete (identifier : number) : void {
    if (!this._programs.has(identifier)) {
      throw new Error(
        'Unable to delete program #' + identifier + ' because there is ' +
        'no program with the given identifier into this system.'
      )
    }

    for (const listener of this._listeners) {
      listener.beforeProgramDeletion(identifier)
    }

    this._programs.delete(identifier)
  }

  /**
  * @see System.destroy
  */
  public destroy () : void {
    while (this._programs.size > 0) {
      this.delete(this._programs.last)
    }

    while (this._listeners.size > 0) {
      this.deleteListener(this._listeners.values().next().value)
    }
  }

  /**
  * Return the fragment shader associated with the given program.
  *
  * @param identifier - Identifier of the program to search.
  *
  * @return The fragment shader of the given program.
  */
  public getFragmentShader (identifier : ProgramIdentifier) : ShaderIdentifier {
    return this._programFragmentShaders.get(identifier)
  }

  /**
  * Return the vertex shader associated with the given program.
  *
  * @param identifier - Identifier of the program to search.
  *
  * @return The vertex shader of the given program.
  */
  public getVertexShader (identifier : ProgramIdentifier) : ShaderIdentifier {
    return this._programVertexShaders.get(identifier)
  }
}
