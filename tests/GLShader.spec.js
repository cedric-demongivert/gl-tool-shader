/* eslint-env jest */

import { ShaderType, Shader, GLShader } from '@library'
import { GLContext } from '@cedric-demongivert/gl-tool-core'
import { createWebGLContext } from './createWebGLContext'

describe('GLShader', function () {
  describe('#constructor', function () {
    it('instantiate a new contextualisation of a given Shader descriptor', function () {
      const context = createWebGLContext(jest)

      const descriptor = new Shader.Vertex()
      descriptor.source = 'source'

      const contextualisation = new GLShader(context, descriptor)

      expect(contextualisation.descriptor).toBe(descriptor)
      expect(contextualisation.source).toBeNull()
      expect(contextualisation.context).toBe(GLContext.of(context))
      expect(contextualisation.shader).toBeNull()
      expect(contextualisation.compiled).toBeFalsy()
    })
  })

  describe('#create', function () {
    it('create the underlying shader', function () {
      const context = createWebGLContext(jest)

      const descriptor = new Shader.Vertex()
      descriptor.source = 'source'

      const contextualisation = new GLShader(context, descriptor)

      const shader = Symbol()

      context.createShader.mockReturnValue(shader)

      expect(contextualisation.shader).toBeNull()

      contextualisation.create()

      expect(contextualisation.source).toBe('source')
      expect(contextualisation.shader).toBe(shader)
      expect(context.createShader).toHaveBeenCalledWith(context.VERTEX_SHADER)
      expect(context.shaderSource).toHaveBeenCalledWith(shader, 'source')
    })

    it('does nothing if the shader was already created', function () {
      const context = createWebGLContext(jest)

      const descriptor = new Shader.Vertex()
      descriptor.source = 'source'

      const contextualisation = new GLShader(context, descriptor)

      const shader = Symbol()
      context.createShader.mockReturnValue(shader)

      contextualisation.create()

      expect(contextualisation.shader).toBe(shader)

      context.createShader.mockClear()
      contextualisation.create()

      expect(contextualisation.shader).toBe(shader)
      expect(context.createShader).not.toHaveBeenCalled()
    })
  })

  describe('#source', function () {
    it('return the source code of this shader', function () {
      const context = createWebGLContext(jest)

      const descriptor = new Shader.Vertex()
      descriptor.source = 'source'

      const contextualisation = new GLShader(context, descriptor)

      const shader = Symbol()

      context.createShader.mockReturnValue(shader)

      expect(contextualisation.source).toBeNull()

      contextualisation.create()

      expect(contextualisation.source).toBe('source')

      descriptor.source = 'pwet'

      expect(contextualisation.source).toBe('source')
    })
  })

  describe('#type', function () {
    it('return the type of this shader', function () {
      const context = createWebGLContext(jest)

      const descriptor = new Shader.Vertex()
      descriptor.source = 'source'

      const contextualisation = new GLShader(context, descriptor)

      const shader = Symbol()
      context.createShader.mockReturnValue(shader)
      contextualisation.create()
      context.getShaderParameter.mockReturnValue(context.VERTEX_SHADER)

      expect(contextualisation.type).toBe(context.VERTEX_SHADER)
      expect(context.getShaderParameter).toHaveBeenCalledWith(
        shader, context.SHADER_TYPE
      )
    })
  })

  describe('#created', function () {
    it('return true if the shader was created, false otherwise', function () {
      const context = createWebGLContext(jest)

      const descriptor = new Shader.Vertex()
      descriptor.source = 'source'

      const contextualisation = new GLShader(context, descriptor)

      const shader = Symbol()
      context.createShader.mockReturnValue(shader)

      expect(contextualisation.created).toBeFalsy()

      contextualisation.create()

      expect(contextualisation.created).toBeTruthy()
    })
  })

  describe('#logs', function () {
    it('return the shader compilation info logs', function () {
      const context = createWebGLContext(jest)

      const descriptor = new Shader.Vertex()
      descriptor.source = 'source'

      const contextualisation = new GLShader(context, descriptor)

      const shader = Symbol()
      context.createShader.mockReturnValue(shader)
      contextualisation.create()

      context.getShaderInfoLog.mockReturnValue('logs')

      expect(contextualisation.logs).toBe('logs')
      expect(context.getShaderInfoLog).toHaveBeenCalledWith(shader)
    })
  })

  describe('#compile', function () {
    it('compile the shader', function () {
      const context = createWebGLContext(jest)

      const descriptor = new Shader.Vertex()
      descriptor.source = 'source'

      const contextualisation = new GLShader(context, descriptor)

      const shader = Symbol()
      context.createShader.mockReturnValue(shader)
      contextualisation.create()

      context.getShaderParameter.mockReturnValue(true)

      expect(contextualisation.compiled).toBeFalsy()

      contextualisation.compile()

      expect(contextualisation.compiled).toBeTruthy()
      expect(context.compileShader).toHaveBeenCalledWith(shader)
      expect(context.getShaderParameter).toHaveBeenCalledWith(
        shader, context.COMPILE_STATUS
      )
    })

    it('create the shader if the shader was not created', function () {
      const context = createWebGLContext(jest)

      const descriptor = new Shader.Vertex()
      descriptor.source = 'source'

      const contextualisation = new GLShader(context, descriptor)

      const shader = Symbol()
      context.createShader.mockReturnValue(shader)
      contextualisation.create = jest.fn(contextualisation.create)
      context.getShaderParameter.mockReturnValue(true)

      contextualisation.compile()

      expect(contextualisation.create).toHaveBeenCalled()
      expect(context.compileShader).toHaveBeenCalledWith(shader)
    })

    it('does nothing if the shader was already compiled', function () {
      const context = createWebGLContext(jest)

      const descriptor = new Shader.Vertex()
      descriptor.source = 'source'

      const contextualisation = new GLShader(context, descriptor)

      const shader = Symbol()
      context.createShader.mockReturnValue(shader)
      contextualisation.create = jest.fn(contextualisation.create)
      context.getShaderParameter.mockReturnValue(true)
      contextualisation.compile()

      context.compileShader.mockClear()

      contextualisation.compile()

      expect(context.compileShader).not.toHaveBeenCalled()
    })

    it('throw an error if the compilation fails', function () {
      const context = createWebGLContext(jest)

      const descriptor = new Shader.Vertex()
      descriptor.source = 'source'

      const contextualisation = new GLShader(context, descriptor)

      const shader = Symbol()
      context.createShader.mockReturnValue(shader)
      contextualisation.create = jest.fn(contextualisation.create)
      context.getShaderParameter.mockReturnValue(false)

      expect(_ => contextualisation.compile()).toThrow()
    })

    it('throw an error if the shader does not have a source code to compile', function () {
      const context = createWebGLContext(jest)

      const descriptor = new Shader.Vertex()

      const contextualisation = new GLShader(context, descriptor)

      const shader = Symbol()
      context.createShader.mockReturnValue(shader)
      contextualisation.create = jest.fn(contextualisation.create)
      context.getShaderParameter.mockReturnValue(false)

      expect(_ => contextualisation.compile()).toThrow()
    })
  })

  describe('#destroy', function () {
    it('destroy the underlying shader', function () {
      const context = createWebGLContext(jest)

      const descriptor = new Shader.Vertex()
      descriptor.source = 'source'

      const contextualisation = new GLShader(context, descriptor)

      const shader = Symbol()
      context.createShader.mockReturnValue(shader)
      contextualisation.create()

      contextualisation.destroy()

      expect(context.deleteShader).toHaveBeenCalledWith(shader)
    })

    it('does nothing if the shader was not created', function () {
      const context = createWebGLContext(jest)

      const descriptor = new Shader.Vertex()
      descriptor.source = 'source'
      
      const contextualisation = new GLShader(context, descriptor)

      contextualisation.destroy()

      expect(context.deleteShader).not.toHaveBeenCalled()
    })
  })
})
