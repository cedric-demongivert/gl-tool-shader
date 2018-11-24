/* eslint-env jest */

import { Shader, Program, GLProgram } from '@library'
import { createWebGLContext } from './createWebGLContext'

describe('Program', function () {
  describe('#constructor', function () {
    it('instanciate a program with a vertex and a fragment shader', function () {
      const vertexShader = new Shader.Vertex('vertex vode')
      const fragmentShader = new Shader.Fragment('fragment code')

      const program = new Program(vertexShader, fragmentShader)

      expect(program.vertex).toBe(vertexShader)
      expect(program.fragment).toBe(fragmentShader)
    })

    it('throw an error if a fragment shader is passed as a vertex shader', function () {
      const fragmentShader = new Shader.Fragment('fragment code')
      expect(_ => new Program(fragmentShader, fragmentShader)).toThrow()
    })

    it('throw an error if a vertex shader is passed as a fragment shader', function () {
      const vertexShader = new Shader.Vertex('vertex vode')
      expect(_ => new Program(vertexShader, vertexShader)).toThrow()
    })
  })

  describe('#contextualise', function () {
    it('create a contextualised instance of the program', function () {
      const context = createWebGLContext(jest)
      const vertexShader = new Shader.Vertex('vertex vode')
      const fragmentShader = new Shader.Fragment('fragment code')

      const descriptor = new Program(vertexShader, fragmentShader)
      const contextualisation = descriptor.contextualise(context)

      expect(contextualisation.descriptor).toBe(descriptor)
      expect(contextualisation).toBeInstanceOf(GLProgram)
    })
  })
})
