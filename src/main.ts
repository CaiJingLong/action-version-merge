import * as core from '@actions/core'
import {context} from '@actions/github'
import doAction from './action'
import check from './check'

async function run(): Promise<void> {
  try {
    core.debug(`context: ${JSON.stringify(context, null, 2)}`)
    check()
    await doAction()
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`Unkown error: ${error}`)
    }
  }
}

run()
