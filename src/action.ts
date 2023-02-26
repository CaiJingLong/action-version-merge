import {context} from '@actions/github'
import {Octokit} from '@octokit/rest'
import config from './config'
import semver from 'semver'

const github = new Octokit({
  auth: `token ${config.token}`
})

interface StatusError {
  status: number
}

export default async function doAction(): Promise<void> {
  const tag = context.ref.replace('refs/tags/', '')
  const sha = context.sha

  const version = semver.parse(tag)

  if (version === null) {
    throw new Error(`Invalid tag: ${tag}`)
  }

  const {release: isRelease, minor: isMinor, preRelease} = config

  const {owner, repo} = context.repo
  // Get the default branch tags

  if (isRelease) {
    // Check release exists
    try {
      await github.repos.getReleaseByTag({
        owner,
        repo,
        tag
      })
    } catch (e) {
      const error = e as StatusError
      if (error.status === 404) {
        await github.repos.createRelease({
          owner,
          repo,
          tag_name: tag,
          name: tag,
          generate_release_notes: true
        })
      }
    }
  }

  if (!preRelease) {
    if (version.prerelease.length > 0) {
      return
    }
  }

  const {major, minor} = version

  // Create major branch
  await mergeToBranch(`v${major}`, tag, sha)

  if (isMinor) {
    await mergeToBranch(`v${major}.${minor}`, tag, sha)
  }
}

async function mergeToBranch(
  branch: string,
  tag: string,
  sha: string
): Promise<void> {
  const {owner, repo} = context.repo
  // Check branch exists
  try {
    await github.repos.getBranch({
      owner,
      repo,
      branch
    })
  } catch (e) {
    const error = e as StatusError
    if (error.status === 404) {
      await github.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branch}`,
        sha
      })
    }
  }

  await github.repos.merge({
    owner,
    repo,
    base: branch,
    head: tag
  })
}
