import { decode as decodeJwt } from 'jwt-simple'
import { ObjectID } from 'mongodb'

import getConnectedClient from '../getConnectedClient'

import { secret } from '../../constants/jwtSecret'

const createGroup = async ({ jwt, messageId, content, name }) => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const messagesCollection = db.collection('messages')
  const groupCollection = db.collection('groups')
  const usersCollection = db.collection('users')

  const { userId } = decodeJwt(jwt, secret)

  const user = await usersCollection.findOne({ _id: new ObjectID(userId), verificationCode: { $exists: false } })

  if (!user) {
    return { success: false }
  }

  const message = await messagesCollection.findOne({ _id: new ObjectID(messageId) })

  if (!message) {
    return { success: false }
  }

  const newGroup = { userId, messageId, content, name }

  const result = await groupCollection.insertOne(newGroup)

  return { success: true, group: { ...newGroup, id: result.insertedId } }
}

export default createGroup
