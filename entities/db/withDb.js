import getConnectedClient from './getConnectedClient'

const withDb = async srpcs => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  process.on('beforeExit', (code) => {
    console.log('Process beforeExit event with code: ', code)
    connectedClient.close()
  })

  const result = Object.fromEntries(
    Object.entries(srpcs)
      .map(([key, srpc]) => [key, payload => srpc({ ...payload, db })])
  )

  return result
}

export default withDb
