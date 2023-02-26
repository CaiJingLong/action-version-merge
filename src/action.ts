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
  const tags = await github.paginate(github.repos.listTags, {
    owner,
    repo,
    per_page: 100
  })

  const validTags = tags.filter(tag => semver.valid(tag.name))

  // 找到每个主要版本的最新版本
  validTags.map(tag => {
    semver.major(tag.name)
  })
}
