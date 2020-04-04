import { MongoClient } from 'mongodb'

const getConnectedClient = async () => {
  const url = 'mongodb://piliponful:password123@localhost:27017/test'

  const client = await MongoClient.connect(url)

  return client
}

const saveMessage = async ({ content }) => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const messagesCollection = db.collection('messages')

  await messagesCollection.insertOne({ content })

  await connectedClient.close()

  return { success: true }
}

export default saveMessage
