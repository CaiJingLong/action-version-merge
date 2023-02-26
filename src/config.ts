import * as core from '@actions/core'

interface Config {
  /**
   * Github token
   */
  token: string

  /**
   * If true, the action will not create a release from tag
   * @default false
   */
  release: boolean

  /**
   * If true, will create minor version branch
   *
   * Such as: tag v1.0.0 -> branch v1.0
   *
   * @default true
   */
  minor: boolean

  /**
   * If true, will create major version branch
   *
   * Such as: tag v1.0.0.dev -> branch v1
   *
   * @default false
   */
  preRelease: boolean
}

function getBooleanInput(name: string): boolean {
  return core.getInput(name) === 'true'
}

function getConfig(): Config {
  const token = core.getInput('github-token', {required: true})
  const release = getBooleanInput('release')
  const minor = getBooleanInput('minor')
  const preRelease = getBooleanInput('pre-release')

  return {
    token,
    release,
    minor,
    preRelease
  }
}

const config: Config = getConfig()

export default config
