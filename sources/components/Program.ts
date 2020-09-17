import { Component } from '@cedric-demongivert/gl-tool-ecs'

import { ProgramIdentifier } from '../ProgramIdentifier'
import { ShaderIdentifier } from '../ShaderIdentifier'

import { Shader } from './Shader'

export class Program {
  /**
  * Identifier of this program.
  */
  public identifier : ProgramIdentifier

  /**
  * Vertex shader associated to this program.
  */
  public vertex : Component<Shader>

  /**
  * Fragment shader associated to this program.
  */
  public fragment : Component<Shader>

  /**
  * Create a new program.
  */
  public constructor (
    identifier : ProgramIdentifier = ProgramIdentifier.UNDEFINED
  ) {
    this.identifier = identifier
    this.vertex = null
    this.fragment = null
  }

  public getVertexShaderIdentifier () : ShaderIdentifier {
    if (this.vertex) {
      return this.vertex.data.identifier
    } else {
      return ShaderIdentifier.UNDEFINED
    }
  }

  public getFragmentShaderIdentifier () : ShaderIdentifier {
    if (this.fragment) {
      return this.fragment.data.identifier
    } else {
      return ShaderIdentifier.UNDEFINED
    }
  }

  /**
  * Copy the state of the given component.
  *
  * @param toCopy - A component instance to copy.
  */
  public copy (toCopy : Program) : void {
    this.identifier = toCopy.identifier
    this.vertex = toCopy.vertex
    this.fragment = toCopy.fragment
  }

  /**
  * Reset the state of this component to it's default state.
  */
  public clear () : void {
    this.identifier = ProgramIdentifier.UNDEFINED
    this.vertex = null
    this.fragment = null
  }

  /**
  * @return An instance of shader equals to this one.
  */
  public clone () : Program {
    const clone : Program = new Program()
    clone.copy(this)
    return clone
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Program) {
      return other.identifier === this.identifier &&
             Component.equals(other.vertex, this.vertex) &&
             Component.equals(other.fragment, this.fragment)
    }

    return false
  }
}

export namespace Program {
  export function copy (toCopy : undefined) : undefined
  export function copy (toCopy : null) : null
  export function copy (toCopy : Program) : Program
  /**
  * Return an instance of program that is equal to the given one.
  *
  * @param toCopy - A program instance to copy.
  * @return An instance of program that is equal to the given one.
  */
  export function copy (toCopy : Program | undefined | null) : Program | undefined | null {
    return toCopy == null ? toCopy : toCopy.clone()
  }
}
