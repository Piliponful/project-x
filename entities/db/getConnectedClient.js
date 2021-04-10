import { MongoClient } from 'mongodb'

const getConnectedClient = async () => {
  const { DB_HOST, DB_USER, DB_USER_PASSWORD, DB_NAME, DB_PORT } = process.env
  console.log(`mongodb://${DB_USER}:${DB_USER_PASSWORD}@${DB_HOST}${DB_PORT ? `:${DB_PORT}` : ''}/${DB_NAME}`)

  const url = `mongodb://${DB_USER}:${DB_USER_PASSWORD}@${DB_HOST}${DB_PORT ? `:${DB_PORT}` : ''}/${DB_NAME}`

  const client = await (new MongoClient(url, { useUnifiedTopology: true })).connect()

  return client
}

export default getConnectedClient
