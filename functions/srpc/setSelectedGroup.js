import { decode as decodeJwt } from 'jwt-simple'
import { ObjectID } from 'mongodb'

import getConnectedClient from '../getConnectedClient'

import { secret } from '../../constants/jwtSecret'

const setSelectedGroup = async ({ jwt, groupId }) => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const groupsCollection = db.collection('groups')
  const usersCollection = db.collection('users')

  const { userId } = decodeJwt(jwt, secret)

  const user = await usersCollection.findOne({ _id: new ObjectID(userId), verificationCode: { $exists: false } })

  if (!user) {
    return { success: false }
  }

  const group = await groupsCollection.findOne({ _id: new ObjectID(groupId) })

  if (!group) {
    return { success: false }
  }

  await groupsCollection.updateOne({ _id: new ObjectID(groupId) }, { $set: { selected: true } })

  await groupsCollection.findOneAndUpdate({ selected: true }, { $unset: { selected: true } })

  return { success: true }
}

export default setSelectedGroup
