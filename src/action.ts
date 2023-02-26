import {context} from '@actions/github'
import {Octokit} from '@octokit/rest'
import config from './config'
import semver from 'semver'

const github = new Octokit({
  auth: `token ${config.token}`
})

export default async function doAction(): Promise<void> {
  const {owner, repo} = context.repo
  // Get the default branch tags

  // Get version from tag
}
