import { ShaderType } from '../ShaderType'
import { ShaderSource } from '../ShaderSource'
import { ShaderIdentifier } from '../ShaderIdentifier'

export class Shader {
  /**
  * Identifier of this shader, may be ShaderIdentifier.UNDEFINED by default.
  */
  public identifier : ShaderIdentifier

  /**
  * The nature of this shader (fragment, vertex, other...).
  */
  public type : ShaderType

  /**
  * The source code attached to this shader.
  */
  public readonly source : ShaderSource

  /**
  * Instantiate a new default shader component.
  *
  * @param [type = ShaderType.VERTEX] - Type of shader to instantiate.
  * @param [identifier = ShaderIdentifier.UNDEFINED] - Identifier of the shader to instantiate.
  */
  public constructor (
    type : ShaderType = ShaderType.VERTEX,
    identifier : ShaderIdentifier = ShaderIdentifier.UNDEFINED
  ) {
    this.identifier = identifier
    this.type = type
    this.source = new ShaderSource()
  }

  /**
  * Copy the state of the given shader component.
  *
  * @param toCopy - A shader component instance to copy.
  */
  public copy (toCopy : Shader) : void {
    this.identifier = toCopy.identifier
    this.type = toCopy.type
    this.source.copy(toCopy.source)
  }

  /**
  * Reset the state of this shader to the default state of a shader component.
  */
  public clear () : void {
    this.identifier = Number.MAX_SAFE_INTEGER
    this.type = ShaderType.VERTEX
    this.source.clear()
  }

  /**
  * @return An instance of shader equals to this one.
  */
  public clone () : Shader {
    const clone : Shader = new Shader()
    clone.copy(this)
    return clone
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Shader) {
      return other.identifier === this.identifier &&
             other.type === this.type &&
             other.source.equals(other.source)
    }

    return false
  }
}

export namespace Shader {
  export function copy (toCopy : undefined) : undefined
  export function copy (toCopy : null) : null
  export function copy (toCopy : Shader) : Shader
  /**
  * Return an instance of shader that is equal to the given one.
  *
  * @param toCopy - A shader instance to copy.
  *
  * @return An instance of shader that is equal to the given one.
  */
  export function copy (toCopy : Shader | undefined | null) : Shader | undefined | null {
    return toCopy == null ? toCopy : toCopy.clone()
  }
}
