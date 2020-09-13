import { WebGLProgramParameter } from './WebGLProgramParameter'
import { WebGLAttributeMetadata } from './WebGLAttributeMetadata'
import { WebGLFieldType } from './WebGLFieldType'

/**
* Meta data of each attributes declared in a webgl program.
*/
export class WebGLAttributes {
  private _program : WebGLProgram
  private _context : WebGLRenderingContext
  public readonly attributes : Map<string, WebGLAttributeMetadata>

  /**
  * Create a new attributes instance.
  */
  public constructor () {
    this._context = null
    this._program = null
    this.attributes = new Map<string, WebGLAttributeMetadata>()
  }

  /**
  * @return The program handled by this object.
  */
  public get program () : WebGLProgram {
    return this._program
  }

  /**
  * @return The context of the program handled by this object.
  */
  public get context () : WebGLRenderingContext {
    return this._context
  }

  /**
  * Commit the data of the active array buffer.
  *
  * @param name - Name of the attribute to set.
  * @param [normalized = false] - See documentation of https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
  * @param [stride = 0] - See documentation of https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
  * @param [offset = 0] - See documentation of https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
  */
  public set (name : string, normalized : boolean = false, stride : number = 0, offset : number = 0) : void {
    const attribute : WebGLAttributeMetadata = this.attributes.get(name)

    this._context.vertexAttribPointer(
      attribute.location,
      WebGLFieldType.scalarSize(attribute.type),
      WebGLFieldType.scalar(attribute.type),
      normalized,
      stride,
      offset
    )
  }

  /**
  * Enable an attribute by using its name.
  */
  public enable (name : string) : void {
    this._context.enableVertexAttribArray(this.attributes.get(name).location)
  }

  /**
  * Disable an attribute by using its name.
  */
  public disable (name : string) : void {
    this._context.disableVertexAttribArray(this.attributes.get(name).location)
  }

  /**
  * Capture all attributes data from the related program.
  */
  public update () : void  {
    this.attributes.clear()

    if (this._context.getProgramParameter(this._program, WebGLProgramParameter.LINK_STATUS)) {
      const webgl   : WebGLRenderingContext = this._context
      const program : WebGLProgram = this._program
      const size    : number = webgl.getProgramParameter(program, WebGLProgramParameter.ACTIVE_ATTRIBUTES)

      for (let index = 0; index < size; ++index) {
        const info : WebGLActiveInfo = webgl.getActiveAttrib(program, index)

        this.attributes.set(info.name, {
          name: info.name,
          type: info.type,
          size: info.size,
          location: webgl.getAttribLocation(program, info.name)
        })
      }
    }
  }

  /**
  * Change the underlying program managed by this instance.
  *
  * @param context - The rendering context of the program to handle.
  * @param program - A program that declare the attributes.
  */
  public handle (context : WebGLRenderingContext, program : WebGLProgram) : void {
    this._context = context
    this._program = program
    this.update()
  }

  /**
  * Iterate over each registered attribute.
  */
  public * [Symbol.iterator] () : Iterator<WebGLAttributeMetadata> {
    return this.attributes.values()
  }
}
