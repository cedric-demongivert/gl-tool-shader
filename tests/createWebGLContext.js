export function createWebGLContext (jest) {
  const handlers = new Map()

  return new Proxy({}, {
    get (target, prop, receiver) {
      if (!handlers.has(prop)) {
        handlers.set(prop, jest.fn())
      }

      return handlers.get(prop)
    },
    has (target, key) {
      return true
    }
  })
}
