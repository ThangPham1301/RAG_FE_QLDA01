import '@testing-library/jest-dom'
import { TextDecoder, TextEncoder } from 'util'

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder
}

global.ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}

Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
})
