import { decode as decodeJwt } from 'jwt-simple'
import { ObjectID } from 'mongodb'

import getConnectedClient from '../getConnectedClient'

import { secret } from '../../constants/jwtSecret'

const saveMessage = async ({ jwt, content, parentMessageId }) => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const messagesCollection = db.collection('messages')
  const usersCollection = db.collection('users')

  const { userId } = decodeJwt(jwt, secret)

  const user = await usersCollection.findOne({ _id: new ObjectID(userId), verificationCode: { $exists: false } })

  if (!user) {
    return { success: false }
  }

  if (parentMessageId) {
    const responseMessage = await messagesCollection.findOne({ userId, parentMessageId })

    if (responseMessage) {
      return { success: false }
    }

    const parentMessage = await messagesCollection.findOne({ _id: new ObjectID(parentMessageId) })

    if (parentMessage.userId === userId) {
      return { success: false }
    }
  }

  const newMessage = { userId, content, parentMessageId }

  const result = await messagesCollection.insertOne(newMessage)

  await connectedClient.close()

  const answersCount = newMessage.parentMessageId ? {} : { answersCount: { yes: 0, no: 0 } }

  return {
    success: true,
    message: {
      ...newMessage,
      id: result.insertedId,
      ...answersCount
    }
  }
}

export default saveMessage
