import { Allocator } from '@cedric-demongivert/gl-tool-collection'

const EMPTY_STRING : string = ''

export class ShaderSource {
  public timestamp : number
  public content : string

  public constructor () {
    this.content = EMPTY_STRING
    this.timestamp = 0
  }

  public set (content : string | null) : void {
    if (content == null) {
      this.content = EMPTY_STRING
    } else {
      this.content = content
    }

    this.timestamp = Date.now()
  }

  public isEmpty () : boolean {
    return this.content.length === 0
  }

  public clear () : void {
    this.content = EMPTY_STRING
    this.timestamp = 0
  }

  public clone () : ShaderSource {
    const copy : ShaderSource = new ShaderSource()

    copy.copy(this)

    return copy
  }

  public copy (toCopy : ShaderSource) : void {
    this.timestamp = toCopy.timestamp
    this.content = toCopy.content
  }

  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof ShaderSource) {
      return other.timestamp === this.timestamp &&
             other.content === this.content
    }
  }
}

export namespace ShaderSource {
  export function copy (toCopy : undefined) : undefined
  export function copy (toCopy : null) : null
  export function copy (toCopy : ShaderSource) : ShaderSource
  export function copy (toCopy : ShaderSource | undefined | null) : ShaderSource | undefined | null {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  export const ALLOCATOR : Allocator<ShaderSource> = {
    /**
    * @see Allocator.allocate
    */
    allocate () : ShaderSource {
      return new ShaderSource()
    },

    /**
    * @see Allocator.clear
    */
    clear (instance : ShaderSource) : void {
      instance.clear()
    },

    /**
    * @see Allocator.copy
    */
    copy (source : ShaderSource, destination : ShaderSource) : void {
      source.copy(destination)
    }
  }
}
