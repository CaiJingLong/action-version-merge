import {Octokit} from '@octokit/rest'
import {test} from '@jest/globals'
import {env} from 'process'
const github = new Octokit({
  auth: `token ${env.GITHUB_TOKEN}`
})
const owner = 'caijinglong'
const repo = 'action-version-merge'

test('Test Error', async () => {
  const branch = 'v0.1'

  const {data} = await github.repos.getBranch({
    owner,
    repo,
    branch
  })

  console.log(data.commit.sha)
})
