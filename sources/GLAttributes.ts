import { GLProgram } from './GLProgram'
import { ProgramParameter } from './ProgramParameter'
import { AttributeMetadata } from './AttributeMetadata'
import { FieldType } from './FieldType'

/**
* Meta data of each attributes declared in a webgl program.
*/
export class GLAttributes {
  public readonly program : GLProgram
  public readonly attributes : Map<string, AttributeMetadata>

  /**
  * Create a new attributes instance for a given program.
  *
  * @param program - A program that declare the attributes.
  */
  public constructor (program : GLProgram) {
    this.program = program
    this.attributes = new Map<string, AttributeMetadata>()
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
    const attribute : AttributeMetadata = this.attributes.get(name)
    
    this.program.webgl.vertexAttribPointer(
      attribute.location,
      FieldType.scalarSize(attribute.type),
      FieldType.scalar(attribute.type),
      normalized,
      stride,
      offset
    )
  }

  /**
  * Enable an attribute by using its name.
  */
  public enable (name : string) : void {
    this.program.webgl.enableVertexAttribArray(this.attributes.get(name).location)
  }

  /**
  * Disable an attribute by using its name.
  */
  public disable (name : string) : void {
    this.program.webgl.disableVertexAttribArray(this.attributes.get(name).location)
  }

  /**
  * Capture all attributes data from the related program.
  */
  public update () : void  {
    if (!this.program.linked) {
      throw new Error (
        'Trying to refresh metadata of attributes from an unlinked program.'
      )
    }

    this.attributes.clear()

    const webgl   : WebGLRenderingContext = this.program.webgl
    const program : WebGLProgram = this.program.program
    const size    : number = webgl.getProgramParameter(program, ProgramParameter.ACTIVE_ATTRIBUTES)

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

  /**
  * Iterate over each registered attribute.
  */
  public * [Symbol.iterator] () : Iterator<AttributeMetadata> {
    return this.attributes.values()
  }
}
