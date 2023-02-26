import {Octokit} from '@octokit/rest'
import {test, expect} from '@jest/globals'
import {env} from 'process'
const github = new Octokit({
  auth: `token ${env.GITHUB_TOKEN}`
})
const owner = 'caijinglong'
const repo = 'action-version-merge'

test('Test Error', async () => {
  const branch = '1.0.0'

  expect(async () => {
    await github.repos.getBranch({
      owner,
      repo,
      branch
    })
  }).rejects.toThrow()
})
