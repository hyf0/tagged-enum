import { Some, match, isVariantOf, None } from '../..'

describe('Option', () => {
  describe('Some', () => {
    it('match', () => {
      const right = 1
      const optionNum = Some(right)
      const fn = jest.fn()
      match(optionNum)({
        Some(left) {
          fn(left)
        },
        None() {
          fn()
        },
      })
      expect(fn).toBeCalledWith(right)
      expect(fn).toBeCalledTimes(1)
    })

    it('isVariantOf', () => {
      const right = 1
      const optionNum = Some(right)
      const leftFn = jest.fn()
      if (isVariantOf(Some)(optionNum)) {
        leftFn(optionNum.payload)
      } else {
        leftFn()
      }
      expect(leftFn).toBeCalledWith(right)
      expect(leftFn).toBeCalledTimes(1)
    })
  })

  describe('None', () => {
    it('match', () => {
      const optionNum = None()
      const fn = jest.fn()
      match(optionNum)({
        Some(left) {
          fn(left)
        },
        None() {
          fn()
        },
      })
      expect(fn).toBeCalledWith()
      expect(fn).toBeCalledTimes(1)
    })

    it('isVariantOf', () => {
      const optionNum = None()
      const fn = jest.fn()
      if (isVariantOf(Some)(optionNum)) {
        fn(optionNum.payload)
      } else {
        fn()
      }
      expect(fn).toBeCalledWith()
      expect(fn).toBeCalledTimes(1)
    })

    it('should be same instance for called None()', () => {
      expect(None()).toBe(None())
    })
  })
})
