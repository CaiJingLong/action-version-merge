import {context} from '@actions/github'
import {Octokit} from '@octokit/rest'
import config from './config'
import semver from 'semver'
import {info as log} from '@actions/core'

const github = new Octokit({
  auth: `token ${config.token}`
})

interface StatusError {
  status: number
}

export default async function doAction(): Promise<void> {
  const tag = context.ref.replace('refs/tags/', '')
  const sha = context.sha

  log(`Current tag: ${tag}, sha: ${sha}`)

  const version = semver.parse(tag)

  if (version === null) {
    throw new Error(`Invalid tag: ${tag}`)
  }

  const {release: isRelease, minor: isMinor, preRelease} = config

  const {owner, repo} = context.repo
  // Get the default branch tags

  if (isRelease) {
    log(`Create release: ${tag}`)

    // Check release exists
    try {
      await github.repos.getReleaseByTag({
        owner,
        repo,
        tag
      })

      log(`Release ${tag} already exists, skip create.`)
    } catch (e) {
      const error = e as StatusError
      if (error.status === 404) {
        log(`Release ${tag} not exists, create it.`)
        await github.repos.createRelease({
          owner,
          repo,
          tag_name: tag,
          name: tag,
          generate_release_notes: true
        })
        log(`Release ${tag} created.`)
      } else {
        throw e
      }
    }
  }

  if (!preRelease) {
    if (version.prerelease.length > 0) {
      log(`Because input pre is false, skip merge to branch.`)
      return
    }
  }

  const {major, minor} = version

  // Create major branch
  await mergeToBranch(`v${major}`, tag, sha)

  if (isMinor) {
    await mergeToBranch(`v${major}.${minor}`, tag, sha)
  }

  log(`Action done.`)
}

async function mergeToBranch(
  branch: string,
  tag: string,
  sha: string
): Promise<void> {
  log(`Prepare merge ${tag} -> ${branch}...`)
  const {owner, repo} = context.repo
  // Check branch exists
  try {
    log(`Check branch ${branch} exists...`)
    await github.repos.getBranch({
      owner,
      repo,
      branch
    })
    log(`Branch ${branch} exists. Skip create.`)
  } catch (e) {
    const error = e as StatusError
    if (error.status === 404) {
      log(`Branch ${branch} not exists, create it.`)
      await github.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branch}`,
        sha
      })
      log(`Branch ${branch} created.`)
    } else {
      throw e
    }
  }

  log(`Merge ${tag} -> ${branch}...`)
  await github.repos.merge({
    owner,
    repo,
    base: branch,
    head: tag
  })

  log(`Merge ${tag} -> ${branch} done.`)
}
