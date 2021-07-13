import { Toolkit } from 'actions-toolkit'
import { bumpVersion } from './helpers/bumper'
const { version } = require('../version.json')

console.log(`Version ${version}`)

Toolkit.run(async (tools) => {
  let fileName = process.env.VERSION_FILE_NAME || 'package.json'
  let entry = process.env.VERSION_ENTRY || 'version'
  const githubUser = process.env.GITHUB_USER || 'GitHub Version Bumper'
  const githubEmail =
      process.env.GITHUB_EMAIL || 'github-version-bumper@users.noreply.github.com'

  const commitMessage = 'version bumped to v'

  try {
    // SET USER
    console.log('process-started---')
    await tools.runInWorkspace('git', [
      'config',
      'user.name',
      `"${githubUser}"`,
    ])
    await tools.runInWorkspace('git', [
      'config',
      'user.email',
      `"${githubEmail}"`,
    ])
    let ignoreBump = false

    const currentBranch = /refs\/[a-zA-Z]+\/(.*)/.exec(
        process.env.GITHUB_REF as string,
    )?.[1] as string

    await tools.runInWorkspace('git', ['checkout', currentBranch])

    // Getting last commit information
    const lastCommit =
        JSON.stringify(await tools.runInWorkspace('git', ['log', '-1'])).toLowerCase() || ''

    // console.log('lastcommitmessage', lastCommit)
    console.log('current branch', currentBranch)
    // Bumping Starts
    if(currentBranch === 'master'){
      if (lastCommit.toLowerCase().includes('ci-ignore')) {
        console.log('ci-ignore')
        ignoreBump = true
      } else if (lastCommit.toLowerCase().includes('ci-version=')) {
        const splitted = lastCommit.toLowerCase().split('ci-version=\\"')
        const replace = splitted[1].split('\\"')[0]
        console.log('replace:', replace)
        await bumpVersion(fileName, { replace, entry })
      } else if (lastCommit.toLowerCase().includes('ci-pre=')) {
        console.log('pre')
        const splitted = lastCommit.toLowerCase().split('ci-pre=\\"')
        const pre = splitted[1].split('\\"')[0]
        console.log('pre:', pre)
        await bumpVersion(fileName, { pre, entry })
      } else if (lastCommit.toLowerCase().includes('ci-major')) {
        console.log('major')
        await bumpVersion(fileName, { major: true, entry })
      } else if (lastCommit.toLowerCase().includes('ci-minor')) {
        console.log('minor')
        await bumpVersion(fileName, { minor: true, entry })
      } else {
        console.log('patch')
        await bumpVersion(fileName)
      }
    }
    else if(currentBranch === 'staging' || currentBranch === 'qc'  || currentBranch === 'production' ){
       console.log('current branch is:', currentBranch)
      console.log('entry:', entry)
      console.log('filename demo-',fileName + '-rc' )
      // fileName = fileName + '-rc'
      await bumpVersion(fileName,{ major: true, entry })
    }
    else if(currentBranch === 'alpha'){

    }



    if (!ignoreBump) {
      const newVersion = JSON.parse(tools.getFile(fileName)).version

      await tools.runInWorkspace('git', [
        'commit',
        '-a',
        '-m',
        `ci: ${commitMessage} ${newVersion}`,
      ])

      // PUSH THE CHANGES
      const remoteRepo = `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`
      await tools.runInWorkspace('git', ['pull', '--tags'])
      await tools.runInWorkspace('git', ['tag', newVersion])
      await tools.runInWorkspace('git', ['push', remoteRepo, '--follow-tags'])
      await tools.runInWorkspace('git', ['push', remoteRepo, '--tags'])
    }
  } catch (e) {
    tools.log.fatal(e)
    tools.exit.failure('Failed to bump version')
  }
  tools.exit.success('Version bumped!')
})
