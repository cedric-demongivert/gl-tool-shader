/**
* Meta data of each attributes declared in a webgl program.
*/
export class GLAttributes {
  /**
  * Create a new attributes instance for a given program.
  *
  * @param {GLProgram} program - A program that declare the attributes.
  */
  constructor (program) {
    this._program = program
    this._attributes = new Map()
  }

  get context () {
    return this._program.context
  }

  /**
  * @return {GLProgram} The program that declare the attributes.
  */
  get program () {
    return this._program
  }

  /**
  * @return {number} The number of declared attributes.
  */
  get size () {
    return this._attributes.size()
  }

  /**
  * Commit the data of the active array buffer.
  *
  * @param {string} name - Name of the attribute to set.
  * @param {boolean} [normalized = false] - See documentation of https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
  * @param {number} [stride = 0] - See documentation of https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
  * @param {number} [offset = 0] - See documentation of https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
  */
  set (name, normalized = false, stride = 0, offset = 0) {
    const location = this._attributes.get(name).location
    const type = this._attributes.get(name).type
    const size = this._attributes.get(name).size

    context.vertexAttribPointer(
      location, size, type,
      normalized, stride, offset
    )

    return this
  }

  /**
  * Enable an attribute by using its name.
  */
  enable (name) {
    this.context.context.enableVertexAttribArray(
      this._attributes.get(name).location
    )

    return this
  }

  /**
  * Disable an attribute by using its name.
  */
  disable (name) {
    this.context.context.disableVertexAttribArray(
      this._attributes.get(name).location
    )

    return this
  }

  /**
  * Return a pointer over an attribute by using its name.
  *
  * @param {string} name - Name of the attribute to fetch.
  *
  * @return {WebGLAttributeLocation} A pointer over the requested attribute.
  */
  location (name) {
    return this._attributes.get(name).location
  }

  /**
  * Return the type constant of an attribute by using its name.
  *
  * @param {string} name - Name of the attribute to fetch.
  *
  * @return {number} A webgl constant that describe the type of the requested attribute.
  */
  typeof (name) {
    return this._attributes.get(name).location
  }

  /**
  * Return the size of an attribute by using its name.
  *
  * @param {string} name - Name of the attribute to fetch.
  *
  * @return {number} The size of the requested attribute.
  */
  sizeof (name) {
    return this._attributes.get(name).size
  }

  /**
  * Check if the program declare an attribute.
  *
  * @param {string} name - Name of the attribute to fetch.
  *
  * @return {boolean} True if the given attribute exists and is active.
  */
  has (name) {
    return this._attributes.has(name)
  }

  /**
  * Capture all attributes data from the related program.
  */
  update () {
    if (!this._program.linked) {
      throw new Error (
        "Trying to refresh attributes metadatas from an unlinked program."
      )
    }

    this._attributes.clear()

    const context = this.context.context
    const program = this._program._pointer
    const size = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES)

    for (let index = 0; index < size; ++index) {
      const info = context.getActiveAttrib(program, index)

      this._attributes.set(info.name, {
        type: info.type,
        size: info.size,
        location: context.getAttribLocation(program, info.name)
      })
    }

    return this
  }

  /**
  * Iterate over each registered attribute.
  */
  * [Symbol.iterator] () {
    yield * this._attributes
  }
}
