import {expect, test} from '@jest/globals'
import semver, {SemVer} from 'semver'

test('version log', () => {
  expect(semver.valid('1.2.3')).toBe('1.2.3')
  expect(semver.valid('1.2.3-alpha.1')).toBe('1.2.3-alpha.1')

  expect(semver.major('1.2.3')).toBe(1)
  expect(semver.major('1.2.3-alpha.1')).toBe(1)

  // Get pre-release components
  expect(semver.prerelease('1.2.3-alpha.5')).toEqual(['alpha', 5])

  const version = new SemVer('1.2.3-alpha.5')
  expect(version.prerelease).toEqual(['alpha', 5])
  expect(version.major).toBe(1)
  expect(version.minor).toBe(2)
  expect(version.patch).toBe(3)
  expect(version.version).toBe('1.2.3-alpha.5')
  expect(semver.coerce('1.2.3-alpha.5')?.version).toEqual('1.2.3')

  expect(version.prerelease.length).toBe(2)
  expect(semver.prerelease('1.2.3-alpha.5')?.length).not.toBe(0)
  expect(semver.parse('1.2.3')?.prerelease.length).toBe(0)
})
