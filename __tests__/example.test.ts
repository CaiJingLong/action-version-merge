import {expect, test} from '@jest/globals'

test('Test Error', () => {
  expect(() => {
    throw Error('Test')
  }).toThrow()

  expect(() => {
    throw Error('Test')
  }).toThrow('Test')

  expect(() => {
    throw Error('Test')
  }).toThrowError('Test')

  expect(() => {}).not.toThrow()
})

test('Test true of false', () => {
  expect(true).toBeTruthy()
  expect(1).toBeTruthy()
  expect('test').toBeTruthy()

  expect(false).toBeFalsy()
  expect(0).toBeFalsy()
  expect('').toBeFalsy()
  expect(null).toBeFalsy()
  expect(undefined).toBeFalsy()
})

test('Test value', () => {
  expect(1).toBe(1)
  expect('test').toBe('test')
  expect({}).toEqual({})
  expect({name: 'test'}).toEqual({name: 'test'})
  expect({name: 'test', password: '123'}).toEqual({
    password: '123',
    name: 'test'
  })

  expect(1).not.toBe(2)
  expect('test').not.toBe('test2')
  expect({}).not.toEqual({name: 'test'})
  expect({name: 'test'}).not.toEqual({name: 'test2'})
  expect({name: 'test', password: '123'}).not.toEqual({
    name: 'test',
  })
})
