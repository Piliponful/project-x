import { MongoClient } from 'mongodb'

const getConnectedClient = async () => {
  const url = 'mongodb://piliponful:password123@localhost:27017/test'

  const client = await (new MongoClient(url, { useUnifiedTopology: true })).connect()

  return client
}

const saveMessage = async ({ content }) => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const messagesCollection = db.collection('messages')

  const result = await messagesCollection.insertOne({ content })

  await connectedClient.close()

  return { success: true, message: { content, id: result.insertedId } }
}

export default saveMessage
