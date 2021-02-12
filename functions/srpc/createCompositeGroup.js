import { decode as decodeJwt } from 'jwt-simple'
import { ObjectID } from 'mongodb'

import getConnectedClient from '../getConnectedClient'
import { getGroupUserCount } from '../../entities/group'

import { secret } from '../../constants/jwtSecret'

const createCompositeGroup = async ({ jwt, name, groupIdLeft, groupIdRight, compositionType }) => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const groupsCollection = db.collection('groups')
  const usersCollection = db.collection('users')
  const messagesCollection = db.collection('messages')

  const { userId } = decodeJwt(jwt, secret)

  const user = await usersCollection.findOne({ _id: new ObjectID(userId), verificationCode: { $exists: false } })

  if (!user) {
    return { success: false }
  }

  const group1 = await groupsCollection.findOne({ _id: new ObjectID(groupIdLeft) })
  const group2 = await groupsCollection.findOne({ _id: new ObjectID(groupIdRight) })

  if (!group1 || !group2) {
    return { success: false }
  }

  const newGroup = {
    userId,
    name,
    groupIdLeft,
    groupIdRight,
    compositionType,
    createdAt: Date.now()
  }

  const result = await groupsCollection.insertOne(newGroup)

  return {
    success: true,
    group: {
      ...newGroup,
      id: result.insertedId,
      userCount: await getGroupUserCount(newGroup, { groupsCollection, messagesCollection })
    }
  }
}

export default createCompositeGroup
