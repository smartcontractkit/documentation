#!/usr/bin/env zx
const localRepo = await $`git rev-parse --show-toplevel`
const commitSha = await $`git show --format="%H" --no-patch`
const authorNameOutput = await $`git show --format="%an" --no-patch`
const authorName = authorNameOutput
  .toString()
  .replace(' ', '')
  .replace('\n', '')
  .replace(/\(.*\)/g, '')
const commitSubject = await $`git show --format='%s' --no-patch`
const REF = await $`git rev-parse --abbrev-ref HEAD`
const REPOSITORY = localRepo
  .toString()
  .replace(/\/\S*\//, '')
  .replace('\n', '')
const ORGANISATION = 'smartcontractkit'

await $`VERCEL_ORG_ID=$NX_VERCEL_ORG_ID VERCEL_PROJECT_ID=$NX_VERCEL_PROJECT_ID vercel --scope chainlinklabs --token=$NX_VERCEL_TOKEN --prod -m githubDeployment=1 -m githubCommitAuthorName=${authorName} -m githubCommitAuthorLogin=${authorName} -m githubCommitMessage=${commitSubject} -m githubCommitOrg=${ORGANISATION} -m githubCommitRepo=${REPOSITORY} -m githubCommitRef=${REF} -m githubCommitSha=${commitSha} -m githubOrg=${ORGANISATION} -m githubRepo=${REPOSITORY} ./`
