import { syncTutor } from '../src/helpers'

const aNumbers = process.argv.slice(2)

const addTutor = async () => {
  console.log('Syncing tutor(s)...')
  await Promise.all(aNumbers.map(syncTutor))
  process.exit()
}

addTutor()
