import {context} from '@actions/github'
import core from '@actions/core'
import {Octokit} from '@octokit/rest'
import config from './config'
import semver from 'semver'
import shelljs from 'shelljs'

const github = new Octokit({
  auth: `token ${config.token}`
})

export default async function doAction(): Promise<void> {
  const tag = context.ref.replace('refs/tags/', '')

  const version = semver.parse(tag)

  if (version === null) {
    throw new Error(`Invalid tag: ${tag}`)
  }

  const {release: isRelease, minor: isMinor, preRelease} = config

  const {owner, repo} = context.repo
  // Get the default branch tags

  if (isRelease) {
    await github.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
      name: tag,
      generate_release_notes: true
    })
  }

  if (!preRelease) {
    if (version.prerelease.length > 0) {
      return
    }
  }

  const {major, minor} = version

  // Create major branch
  mergeToBranch(`v${major}`, tag)

  if (isMinor) {
    mergeToBranch(`v${major}.${minor}`, tag)
  }
}

function tryThrowError(str: shelljs.ShellString): shelljs.ShellString {
  if (str.code !== 0) {
    throw new Error(str.stderr)
  }

  return str
}

function mergeToBranch(branch: string, tag: string): shelljs.ShellString {
  // Create branch if not exists
  const cmd = `
  ${loginToken()}
  git checkout -b ${branch}
  git merge ${tag}
  git push origin ${branch}
  `

  core.debug(cmd)

  return tryThrowError(shelljs.exec(cmd))
}

function loginToken(): string {
  const token = config.token

  // login with token
  return `git config --global user.name "github-actions[bot]"
  git config --global user.email "github-actions[bot]@users.noreply.github.com"
  echo "${token}" | gh auth login --with-token --hostname github.com
  gh auth setup-git --hostname github.com
  `
}
