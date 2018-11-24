/* eslint-env jest */

import { Shader, GLProgram, Program } from '@library'
import { GLContext } from '@cedric-demongivert/gl-tool-core'
import { createWebGLContext } from './createWebGLContext'

describe('GLProgram', function () {
  describe('#constructor', function () {
    it('instantiate a new contextualisation of a given Program descriptor', function () {
      const context = createWebGLContext(jest)
      const descriptor = new Program(
        new Shader.Vertex('source'),
        new Shader.Fragment('source')
      )
      const contextualisation = new GLProgram(context, descriptor)

      expect(contextualisation.descriptor).toBe(descriptor)
      expect(contextualisation.context).toBe(GLContext.of(context))
      expect(contextualisation.created).toBeFalsy()
      expect(contextualisation.linked).toBeFalsy()
    })
  })

  describe('#create', function () {
    it('create the program into the context', function () {
      const context = createWebGLContext(jest)
      const descriptor = new Program(
        new Shader.Vertex('source'),
        new Shader.Fragment('source')
      )
      const contextualisation = new GLProgram(context, descriptor)

      const program = Symbol()
      context.createShader.mockImplementation(_ => Symbol())
      context.createProgram.mockReturnValue(program)

      expect(contextualisation.program).toBeNull()
      expect(contextualisation.created).toBeFalsy()

      contextualisation.vertex.create()
      contextualisation.fragment.create()
      contextualisation.create()

      expect(contextualisation.program).toBe(program)
      expect(contextualisation.created).toBeTruthy()
      expect(context.createProgram).toHaveBeenCalled()
      expect(context.attachShader).toHaveBeenCalledWith(program, contextualisation.vertex.shader)
      expect(context.attachShader).toHaveBeenCalledWith(program, contextualisation.fragment.shader)
    })

    it('create underlying shaders if necessary', function () {
      const context = createWebGLContext(jest)
      const descriptor = new Program(
        new Shader.Vertex('source'),
        new Shader.Fragment('source')
      )
      const contextualisation = new GLProgram(context, descriptor)

      const program = Symbol()
      context.createShader.mockImplementation(_ => Symbol())
      context.createProgram.mockReturnValue(program)

      contextualisation.vertex.create = jest.fn(contextualisation.vertex.create)
      contextualisation.fragment.create = jest.fn(contextualisation.fragment.create)
      contextualisation.create()

      expect(contextualisation.program).toBe(program)
      expect(contextualisation.created).toBeTruthy()
      expect(contextualisation.vertex.create).toHaveBeenCalled()
      expect(contextualisation.fragment.create).toHaveBeenCalled()
    })
  })

  describe('#logs', function () {
    it('return the program linking logs', function () {
      const context = createWebGLContext(jest)
      const descriptor = new Program(
        new Shader.Vertex('source'),
        new Shader.Fragment('source')
      )
      const contextualisation = new GLProgram(context, descriptor)

      const program = Symbol()
      context.createShader.mockImplementation(_ => Symbol())
      context.createProgram.mockReturnValue(program)
      contextualisation.create()

      context.getProgramInfoLog.mockReturnValue('log')

      expect(contextualisation.logs).toBe('log')
      expect(context.getProgramInfoLog).toHaveBeenCalledWith(program)
    })
  })

  describe('#used', function () {
    it('return true if the current program is used', function () {
      const context = createWebGLContext(jest)
      const descriptor = new Program(
        new Shader.Vertex('source'),
        new Shader.Fragment('source')
      )
      const contextualisation = new GLProgram(context, descriptor)

      const program = Symbol()
      context.createShader.mockImplementation(_ => Symbol())
      context.createProgram.mockReturnValue(program)
      contextualisation.create()

      context.getParameter.mockReturnValue(program)

      expect(contextualisation.used).toBeTruthy()
      expect(context.getParameter).toHaveBeenCalledWith(context.CURRENT_PROGRAM)
    })

    it('return false otherwise', function () {
      const context = createWebGLContext(jest)
      const descriptor = new Program(
        new Shader.Vertex('source'),
        new Shader.Fragment('source')
      )
      const contextualisation = new GLProgram(context, descriptor)

      const program = Symbol()
      context.createShader.mockImplementation(_ => Symbol())
      context.createProgram.mockReturnValue(program)
      contextualisation.create()

      context.getParameter.mockReturnValue(Symbol())

      expect(contextualisation.used).toBeFalsy()
      expect(context.getParameter).toHaveBeenCalledWith(context.CURRENT_PROGRAM)
    })
  })

  describe('#link', function () {
    it('link the program', function () {
      const context = createWebGLContext(jest)
      const descriptor = new Program(
        new Shader.Vertex('source'),
        new Shader.Fragment('source')
      )
      const contextualisation = new GLProgram(context, descriptor)

      const program = Symbol()
      context.createShader.mockImplementation(_ => Symbol())
      context.createProgram.mockReturnValue(program)
      contextualisation.create()

      context.getProgramParameter.mockReturnValue(true)
      context.getShaderParameter.mockReturnValue(true)
      contextualisation.uniforms.update = jest.fn()
      contextualisation.attributes.update = jest.fn()

      expect(contextualisation.linked).toBeFalsy()

      contextualisation.link()

      expect(contextualisation.linked).toBeTruthy()
      expect(context.linkProgram).toHaveBeenCalledWith(program)
      expect(contextualisation.uniforms.update).toHaveBeenCalled()
      expect(contextualisation.attributes.update).toHaveBeenCalled()
      expect(context.getProgramParameter).toHaveBeenCalledWith(program, context.LINK_STATUS)
    })

    it('create the program if necessary', function () {
      const context = createWebGLContext(jest)
      const descriptor = new Program(
        new Shader.Vertex('source'),
        new Shader.Fragment('source')
      )
      const contextualisation = new GLProgram(context, descriptor)

      const program = Symbol()
      context.createShader.mockImplementation(_ => Symbol())
      context.createProgram.mockReturnValue(program)
      context.getProgramParameter.mockReturnValue(true)
      context.getShaderParameter.mockReturnValue(true)
      contextualisation.uniforms.update = jest.fn()
      contextualisation.attributes.update = jest.fn()

      expect(contextualisation.linked).toBeFalsy()

      contextualisation.link()

      expect(contextualisation.linked).toBeTruthy()
      expect(context.linkProgram).toHaveBeenCalledWith(program)
      expect(contextualisation.uniforms.update).toHaveBeenCalled()
      expect(contextualisation.attributes.update).toHaveBeenCalled()
      expect(context.getProgramParameter).toHaveBeenCalledWith(program, context.LINK_STATUS)
    })

    it('throw if the linking operation fails', function () {
      const context = createWebGLContext(jest)
      const descriptor = new Program(
        new Shader.Vertex('source'),
        new Shader.Fragment('source')
      )
      const contextualisation = new GLProgram(context, descriptor)

      const program = Symbol()
      context.createShader.mockImplementation(_ => Symbol())
      context.createProgram.mockReturnValue(program)
      context.getProgramParameter.mockReturnValue(false)
      context.getShaderParameter.mockReturnValue(true)
      contextualisation.uniforms.update = jest.fn()
      contextualisation.attributes.update = jest.fn()

      expect(_ => contextualisation.link()).toThrow()
    })
  })

  describe('#use', function () {
    it('put the program in use', function () {
      const context = createWebGLContext(jest)
      const descriptor = new Program(
        new Shader.Vertex('source'),
        new Shader.Fragment('source')
      )
      const contextualisation = new GLProgram(context, descriptor)

      const program = Symbol()
      context.createShader.mockImplementation(_ => Symbol())
      context.createProgram.mockReturnValue(program)
      context.getProgramParameter.mockReturnValue(true)
      context.getShaderParameter.mockReturnValue(true)
      contextualisation.uniforms.update = jest.fn()
      contextualisation.attributes.update = jest.fn()
      contextualisation.create()

      contextualisation.use()

      expect(context.useProgram).toHaveBeenCalledWith(program)
    })
  })

  describe('#destroy', function () {
    it('destroy the program', function () {
      const context = createWebGLContext(jest)
      const descriptor = new Program(
        new Shader.Vertex('source'),
        new Shader.Fragment('source')
      )
      const contextualisation = new GLProgram(context, descriptor)

      const program = Symbol()
      context.createShader.mockImplementation(_ => Symbol())
      context.createProgram.mockReturnValue(program)
      context.getProgramParameter.mockReturnValue(true)
      context.getShaderParameter.mockReturnValue(true)
      contextualisation.uniforms.update = jest.fn()
      contextualisation.attributes.update = jest.fn()
      contextualisation.create()

      const vertexShader = contextualisation.vertex.shader
      const fragmentShader = contextualisation.fragment.shader

      contextualisation.destroy()

      expect(context.deleteProgram).toHaveBeenCalledWith(program)
      expect(context.detachShader).toHaveBeenCalledWith(program, vertexShader)
      expect(context.detachShader).toHaveBeenCalledWith(program, fragmentShader)
      expect(contextualisation.program).toBeNull()
    })

    it('does nothing if the program was not created', function () {
      const context = createWebGLContext(jest)
      const descriptor = new Program(
        new Shader.Vertex('source'),
        new Shader.Fragment('source')
      )
      const contextualisation = new GLProgram(context, descriptor)

      expect(context.deleteProgram).not.toHaveBeenCalled()
      expect(context.detachShader).not.toHaveBeenCalled()
      expect(context.detachShader).not.toHaveBeenCalled()
      expect(contextualisation.program).toBeNull()
    })
  })
})
