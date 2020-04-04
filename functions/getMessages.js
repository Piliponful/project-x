import { MongoClient } from 'mongodb'
import { omit } from 'lodash'

const getConnectedClient = async () => {
  const url = 'mongodb://piliponful:password123@localhost:27017/test'

  const client = await (new MongoClient(url, { useUnifiedTopology: true })).connect()

  return client
}

const getMessages = async () => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const messagesCollection = db.collection('messages')

  const messages = (await messagesCollection.find().toArray()).map(i => ({ ...omit(i, '_id'), id: i._id }))

  await connectedClient.close()

  return { success: true, messages }
}

export default getMessages
