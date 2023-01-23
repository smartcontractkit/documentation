#!/usr/bin/env zx
const localRepo = await $`git rev-parse --show-toplevel`

const appName = localRepo
  .toString()
  .replace(/\/\S*\//, '')
  .replace('\n', '')
const appUrl = appName
const lineBreak = '-------------------'

const commitSha = await $`git show --format="%H" --no-patch`
const authorNameOutput = await $`git show --format="%an" --no-patch`
const authorName = authorNameOutput
  .toString()
  .replace(' ', '')
  .replace('\n', '')
  .replace(/\(.*\)/g, '')
const commitSubject = await $`git show --format='%s' --no-patch`
const REF = await $`git rev-parse --abbrev-ref HEAD`
const REPOSITORY = appName
const ORGANISATION = 'smartcontractkit'

const gitBranchName = await $`git branch --show-current`

const alias =
  appName + '-' +
  gitBranchName.stdout.trim().replace(/\//g, '-').slice(0, 30) +
  '-chainlinklabs.vercel.app'

const deployOutput =
  await $`VERCEL_ORG_ID=$NX_VERCEL_ORG_ID VERCEL_PROJECT_ID=$NX_VERCEL_PROJECT_ID vercel --scope chainlinklabs --token=$NX_VERCEL_TOKEN -m githubDeployment=1 -m githubCommitAuthorName=${authorName} -m githubCommitAuthorLogin=${authorName} -m githubCommitMessage=${commitSubject} -m githubCommitOrg=${ORGANISATION} -m githubCommitRepo=${REPOSITORY} -m githubCommitRef=${REF} -m githubCommitSha=${commitSha} -m githubOrg=${ORGANISATION} -m githubRepo=${REPOSITORY} ./`

const appUrlRegex = new RegExp(`https://${appUrl}.*.vercel.app`, 'g')

const deployPreviewUrl = deployOutput.stdout.match(appUrlRegex)

await $`vercel alias ${deployPreviewUrl} ${alias} --token=$NX_VERCEL_TOKEN --scope=chainlinklabs`

console.log(`
${lineBreak}
Documentation commit preview URL: ${deployPreviewUrl}
Documentation branch preview URL: https://${alias}
${lineBreak}
`)
