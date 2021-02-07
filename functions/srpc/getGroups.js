import { decode as decodeJwt } from 'jwt-simple'
import { ObjectID } from 'mongodb'
import { omit } from 'lodash'

import getConnectedClient from '../getConnectedClient'
import { unravelGroup, getUserIdsFromGroupTree } from '../../entities/group'

import { secret } from '../../constants/jwtSecret'

const getGroupUserCount = async (group, db) => {
  const groupTree = await unravelGroup(group, db)

  const userIds = Array.isArray(groupTree) ? groupTree : getUserIdsFromGroupTree(groupTree)

  return userIds.length
}

const getGroups = async ({ jwt }) => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const usersCollection = db.collection('users')
  const groupsCollection = db.collection('groups')
  const messagesCollection = db.collection('messages')

  const { userId } = decodeJwt(jwt, secret)

  const user = await usersCollection.findOne({ _id: new ObjectID(userId), verificationCode: { $exists: false } })

  if (!user) {
    return { success: false }
  }

  const groups = (await groupsCollection.find().sort('createdAt', -1).toArray()).map(i => ({ ...omit(i, '_id'), id: i._id }))

  const groupsWithUserCount = await Promise.all(
    groups.map(async g => ({ ...g, userCount: await getGroupUserCount(g, { groupsCollection, messagesCollection }) }))
  )

  await connectedClient.close()

  return { success: true, groups: groupsWithUserCount }
}

export default getGroups
