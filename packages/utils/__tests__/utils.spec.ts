import { eq, empty, extend, isPojo } from '../src/index'

describe('eq', () => {
  it('evaluates simple primitives correctly', () => {
    expect(eq('123', '123')).toBe(true)
    expect(eq('123', 123)).toBe(false)
    expect(eq(true, true)).toBe(true)
    expect(eq(false, true)).toBe(false)
    expect(eq(function () {}, {})).toBe(false)
  })

  it('evaluates single depth objects correctly', () => {
    const t = { first: 'first', second: 'second' }
    expect(eq(t, t)).toBe(true)
    expect(eq({}, {})).toBe(true)
    expect(eq({ a: '123' }, { a: '123' })).toBe(true)
    expect(eq({ abc: 'abc' }, { abc: 'abc', def: 'def' })).toBe(false)
    expect(eq({ abc: 'abc' }, { abc: 'abcd' })).toBe(false)
    expect(eq(['first'], ['first'])).toBe(true)
    expect(eq(['first'], ['first', 'second'])).toBe(false)
    expect(eq([0, 2, 4, 6], [0, 2, 4, 6])).toBe(true)
  })

  it('evaluates deep objects correctly', () => {
    const t = { first: 'first', second: { name: 'second' } }
    expect(eq(t, t)).toBe(true)
    expect(
      eq(
        {
          name: {
            first: 'jane',
            last: 'flair',
          },
          age: 20,
        },
        {
          name: {
            first: 'jane',
            last: 'flair',
          },
          age: 20,
        }
      )
    ).toBe(true)
  })
  expect(
    eq(
      {
        name: {
          first: 'jane',
          last: 'DIFFERENT',
        },
        age: 20,
      },
      {
        name: {
          first: 'jane',
          last: 'flair',
        },
        age: 20,
      },
      false // Disable depth
    )
  ).toBe(false)
  expect(
    eq(
      {
        name: {
          first: 'jane',
          last: 'DIFFERENT',
        },
        age: 20,
      },
      {
        name: {
          first: 'jane',
          last: 'flair',
        },
        age: 20,
      }
    )
  ).toBe(false)
  expect(eq([{}], [{}])).toBe(true)
  expect(eq([{ a: 250 }], [{ b: { value: 250 } }])).toBe(false)
})

describe('empty', () => {
  it('considers empty strings empty', () => expect(empty('')).toBe(true))
  it('considers spaces not empty', () => expect(empty('  ')).toBe(false))
  it('considers the string zero not empty', () =>
    expect(empty('0')).toBe(false))
  it('considers the number zero not empty', () => expect(empty(0)).toBe(false))
  it('considers empty arrays empty', () => expect(empty([])).toBe(true))
  it('considers empty objects empty', () => expect(empty({})).toBe(true))
  it('considers null empty', () => expect(empty(null)).toBe(true))
  it('considers undefined empty', () => expect(empty(undefined)).toBe(true))
  it('considers an array with value zero not empty', () =>
    expect(empty(['a'])).toBe(false))
  it('considers an object with key not empty', () =>
    expect(empty({ a: undefined })).toBe(false))
})

describe('isPojo', () => {
  it('does not consider a FormKitNode a pojo', () => {
    expect(isPojo({ __FKNode__: true })).toBe(false)
  })
  it('checks the __POJO__ property', () => {
    expect(isPojo({ __POJO__: false })).toBe(false)
  })
})

describe('extend', () => {
  it('adds properties to objects as base depth', () =>
    expect(extend({ a: 123 }, { b: 123 })).toEqual({ a: 123, b: 123 }))

  it('changes properties to objects as base depth', () =>
    expect(extend({ a: 123 }, { a: 345 })).toEqual({ a: 345 }))

  it('removes properties to objects as base depth', () =>
    expect(extend({ a: 123 }, { a: undefined })).toEqual({}))

  it('removes properties to objects as base depth', () =>
    expect(extend({ a: 123 }, { a: undefined })).toEqual({}))

  it('replaces array values completely', () =>
    expect(extend({ a: ['first'] }, { a: ['second'] })).toEqual({
      a: ['second'],
    }))

  it('can change a property at depth', () => {
    expect(
      extend(
        {
          a: 123,
          b: {
            first: {
              third: 3,
            },
            second: {
              z: 'fire',
            },
          },
          c: 'boop',
        },
        {
          b: { second: { z: 'ice' } },
        }
      )
    ).toEqual({
      a: 123,
      b: {
        first: {
          third: 3,
        },
        second: {
          z: 'ice',
        },
      },
      c: 'boop',
    })
  })
})