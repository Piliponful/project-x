import { MongoClient } from 'mongodb'
import { decode as decodeJwt } from 'jwt-simple'

const getConnectedClient = async () => {
  const url = 'mongodb://piliponful:password123@localhost:27017/test'

  const client = await (new MongoClient(url, { useUnifiedTopology: true })).connect()

  return client
}

const saveMessage = async ({ jwt, content }) => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const messagesCollection = db.collection('messages')
  const usersCollection = db.collection('users')

  const { userId } = decodeJwt(jwt)

  const user = await usersCollection.findOne({ _id: userId, verificationCode: { $exists: false } })

  if (!user) {
    return { success: false }
  }

  const result = await messagesCollection.insertOne({ content })

  await connectedClient.close()

  return { success: true, message: { content, id: result.insertedId } }
}

export default saveMessage
