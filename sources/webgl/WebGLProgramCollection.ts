import { System } from '@cedric-demongivert/gl-tool-ecs'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { ProgramCollectionListener } from '../systems/ProgramCollectionListener'
import { ProgramCollection } from '../systems/ProgramCollection'

import { ProgramIdentifier } from '../ProgramIdentifier'
import { ShaderIdentifier } from '../ShaderIdentifier'

import { WebGLProgramLinkingError } from './WebGLProgramLinkingError'
import { WebGLProgramParameter } from './WebGLProgramParameter'
import { WebGLShaderCollection } from './WebGLShaderCollection'
import { WebGLProgramState } from './WebGLProgramState'
import { WebGLShaderState } from './WebGLShaderState'

export class WebGLProgramCollection extends System implements ProgramCollectionListener {
  /**
  * The related webgl context.
  */
  private _webgl : WebGLRenderingContext

  /**
  * A sequence of all existing webgl program indexed by application program.
  */
  private _programs : Pack<WebGLProgram>

  /**
  * A sequence of all existing webgl program states indexed by application program.
  */
  private _states : Pack<WebGLProgramState>

  /**
  * Parent application shader collection.
  */
  private _descriptors : ProgramCollection

  /**
  * The WebGLShaderCollection associated with this program collection.
  */
  private _shaders : WebGLShaderCollection

  /**
  * Instantiate a new webgl shader collection for a given context.
  *
  * @param shaders - A collection of webgl shaders.
  */
  public constructor (shaders : WebGLShaderCollection) {
    super()
    this._programs = Pack.uint32(0)
    this._states = Pack.uint8(0)
    this._webgl = shaders.getContext()
    this._descriptors = null
    this._shaders = shaders
  }

  /**
  * @see ProgramCollectionListener.afterSubscription
  */
  public afterSubscription (collection : ProgramCollection) : void {
    if (this._descriptors == null) {
      this._descriptors = collection
      this._programs.reallocate(this._descriptors.capacity)
      this._states.reallocate(this._descriptors.capacity)
    } else {
      throw new Error(
        'Unable to subscribe this WebGLProgramCollection to the given ' +
        'ProgramCollection because this WebGLProgramCollection was already ' +
        'registered into another ProgramCollection instance.'
      )
    }
  }

  /**
  * @see ProgramCollectionListener.beforeUnsubscription
  */
  public beforeUnsubscription (collection : ProgramCollection) : void {
    if (this._descriptors === collection) {
      this._descriptors = null
      this._programs.reallocate(0)
      this._states.reallocate(0)
    } else {
      throw new Error(
        'Unable to unsubscribe this WebGLProgramCollection from the given ' +
        'ProgramCollection because this WebGLProgramCollection was registered ' +
        'into another ProgramCollection instance.'
      )
    }
  }

  /**
  * @see ProgramCollectionListener.beforeProgramDeletion
  */
  public beforeProgramDeletion (identifier : ProgramIdentifier) : void {
    if (this._states.get(identifier) !== WebGLProgramState.BLANK) {
      this._webgl.deleteProgram(this._programs.get(identifier))
    }
  }

  /**
  * @see ProgramCollectionListener.afterProgramCreation
  */
  public afterProgramCreation (identifier : ProgramIdentifier) : void {
    this._states.set(identifier, WebGLProgramState.BLANK)
  }

  /**
  * @see ProgramCollectionListener.afterProgramUpdate
  */
  public afterProgramUpdate (identifier : ProgramIdentifier) : void {
    if (this._states.get(identifier) !== WebGLShaderState.BLANK) {
      this._states.set(identifier, WebGLShaderState.DIRTY)
    }
  }

  public instantiate (identifier : ProgramIdentifier) : WebGLProgram {
    const state : WebGLProgramState = this._states.get(identifier)

    if (state === WebGLShaderState.BLANK) {
      let program : WebGLProgram = this._webgl.createProgram()
      this._programs.set(identifier, program)
      this._states.set(identifier, WebGLShaderState.DIRTY)
      return program
    } else {
      throw new Error(
        'Unable to instantiate the program #' + identifier + ' because this ' +
        'program was already instantiated and is currently in #' + state +
        ' "' + WebGLProgramState.toString(state) + '" state.'
      )
    }
  }

  public link (identifier : ProgramIdentifier) : void {
    const webgl : WebGLRenderingContext = this._webgl
    const program : WebGLProgram = this._programs.get(identifier)
    const state : WebGLProgramState = this._states.get(identifier)

    switch (state) {
      case WebGLProgramState.ERROR:
        throw new WebGLProgramLinkingError(webgl, program)
      case WebGLProgramState.BLANK:
        throw new Error(
          'Unable to compile program #' + identifier + ' because the given ' +
          'program was not instantiated.'
        )
      case WebGLProgramState.DIRTY:
        if (this._descriptors.hasVertexShader(identifier)) {
          const shader : ShaderIdentifier = this._descriptors.getVertexShader(identifier)
          this._shaders.bootstrap(shader)
          this._shaders.attachShader(program, shader)
        } else {
          throw new Error(
            'Unable to compile program #' + identifier + ' because the given ' +
            'program does not have an associated vertex shader.'
          )
        }

        if (this._descriptors.hasFragmentShader(identifier)) {
          const shader : ShaderIdentifier = this._descriptors.getFragmentShader(identifier)
          this._shaders.bootstrap(shader)
          this._shaders.attachShader(program, shader)
        } else {
          throw new Error(
            'Unable to compile program #' + identifier + ' because the given ' +
            'program does not have an associated fragment shader.'
          )
        }

        webgl.compileShader(program)

        if (!webgl.getShaderParameter(program, WebGLProgramParameter.LINK_STATUS)) {
          this._states.set(identifier, WebGLProgramState.ERROR)
          throw new WebGLProgramLinkingError(webgl, program)
        }

        this._states.set(identifier, WebGLProgramState.READY)
      case WebGLProgramState.READY:
        return
      default:
        throw new Error(
          'Unable to link program #' + identifier + ' in state #' + state +
          ' "' + WebGLProgramState.toString(state) + '" because this ' +
          'WebGLProgramCollection does not define a link procedure ' +
          'for programs in this state.'
        )
    }
  }

  public bootstrap (identifier : ProgramIdentifier) : void {
    const webgl : WebGLRenderingContext = this._webgl
    const state : WebGLProgramState = this._states.get(identifier)

    switch (state) {
      case WebGLProgramState.ERROR:
        throw new WebGLProgramLinkingError(webgl, this._programs.get(identifier))
      case WebGLProgramState.BLANK:
        this.instantiate(identifier)
      case WebGLProgramState.DIRTY:
        this.link(identifier)
      case WebGLProgramState.READY:
        return
      default:
        throw new Error(
          'Unable to bootstrap program #' + identifier + ' in state #' + state +
          ' "' + WebGLProgramState.toString(state) + '" because this ' +
          'WebGLProgramCollection does not define a compilation procedure ' +
          'for shaders in this state.'
        )
    }
  }

  /**
  * Use a program for the next rendering operation.
  */
  public use (identifier : ProgramIdentifier) : void {
    if (this._states.get(identifier) !== WebGLProgramState.BLANK) {
      this._webgl.useProgram(this._programs.get(identifier))
    } else {
      throw new Error(
        'Unable to use the program #' + identifier + ' because this program ' +
        'was not instantiated into this context.'
      )
    }
  }

  /**
  * Release the requested program.
  *
  * @param identifier - Program to free.
  */
  public free (identifier : ProgramIdentifier) : void {
    const state : WebGLProgramState = this._states.get(identifier)

    if (state !== WebGLProgramState.BLANK) {
      this._webgl.deleteProgram(this._programs.get(identifier))
      this._states.set(identifier, WebGLProgramState.BLANK)
    } else {
      throw new Error(
        'Unable to free the program #' + identifier + ' because this ' +
        'program was not instantiated into this context.'
      )
    }
  }

  public getDescriptors () : ProgramCollection {
    return this._descriptors
  }

  public getContext () : WebGLRenderingContext {
    return this._webgl
  }

  public getProgram (program : ProgramIdentifier) : WebGLProgram {
    if (this._states.get(program) !== WebGLProgramState.BLANK) {
      return this._programs.get(program)
    } else {
      throw new Error(
        'Unable to return the pointer associated to the program #' + program +
        ' because this program was not instantiated into this context.'
      )
    }
  }

  public getState (program : ProgramIdentifier) : WebGLProgramState {
    return this._states.get(program)
  }

  /**
  * @see System.destroy
  */
  public destroy () {
    if (this._descriptors != null) {
      this._descriptors.deleteListener(this)
    }
  }
}
