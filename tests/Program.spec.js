/* eslint-env jest */

import { Shader, Program, GLProgram } from '@library'
import { createWebGLContext } from './createWebGLContext'

describe('Program', function () {
  describe('#constructor', function () {
    it('instanciate a program', function () {
      const program = new Program()

      expect(program.vertex).toBeNull()
      expect(program.fragment).toBeNull()
    })
  })

  describe('#set vertex', function () {
    it('change the vertex shader of the program', function () {
      const vertexShader = new Shader.Vertex()
      vertexShader.source = 'vertex code'

      const program = new Program()

      expect(program.vertex).toBeNull()

      program.vertex = vertexShader

      expect(program.vertex).toBe(vertexShader)

      program.vertex = null

      expect(program.vertex).toBeNull()
    })

    it('throw an error if the given shader is not a vertex shader', function () {
      const fragmentShader = new Shader.Fragment()
      fragmentShader.source = 'fragment code'

      const program = new Program()

      expect(_ => program.vertex = fragmentShader).toThrow()
    })
  })

  describe('#set fragment', function () {
    it('change the fragment shader of the program', function () {
      const fragmentShader = new Shader.Fragment()
      fragmentShader.source = 'fragment code'

      const program = new Program()

      expect(program.fragment).toBeNull()

      program.fragment = fragmentShader

      expect(program.fragment).toBe(fragmentShader)

      program.fragment = null

      expect(program.fragment).toBeNull()
    })

    it('throw an error if the given shader is not a fragment shader', function () {
      const vertexShader = new Shader.Vertex()
      vertexShader.source = 'vertex code'

      const program = new Program()

      expect(_ => program.fragment = vertexShader).toThrow()
    })
  })

  describe('#commit', function () {
    it('update all of its contextualisation', function () {
      const contexts = [
        createWebGLContext(jest),
        createWebGLContext(jest),
        createWebGLContext(jest),
        createWebGLContext(jest)
      ]

      const descriptor = new Program()

      const contextualisations = contexts.map(
        context => descriptor.contextualise(context)
      )

      for (const contextualisation of contextualisations) {
        contextualisation.synchronize = jest.fn(_ => {})
      }

      for (const contextualisation of contextualisations) {
        expect(contextualisation.synchronize).not.toHaveBeenCalled()
      }

      descriptor.commit()

      for (const contextualisation of contextualisations) {
        expect(contextualisation.synchronize).toHaveBeenCalled()
      }
    })
  })

  describe('#contextualise', function () {
    it('create a contextualised instance of the program', function () {
      const context = createWebGLContext(jest)
      const vertexShader = new Shader.Vertex('vertex code')
      const fragmentShader = new Shader.Fragment('fragment code')

      const descriptor = new Program(vertexShader, fragmentShader)
      const contextualisation = descriptor.contextualise(context)

      expect(contextualisation.descriptor).toBe(descriptor)
      expect(contextualisation).toBeInstanceOf(GLProgram)
    })
  })
})
