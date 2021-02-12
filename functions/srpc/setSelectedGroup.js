import { decode as decodeJwt } from 'jwt-simple'
import { ObjectID } from 'mongodb'
import { omit } from 'lodash'

import getConnectedClient from '../getConnectedClient'
import { getGroupUserCount } from '../../entities/group'

import { secret } from '../../constants/jwtSecret'

const setSelectedGroup = async ({ jwt, groupId }) => {
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

  const group = await groupsCollection.findOne({ _id: new ObjectID(groupId) })

  if (!group) {
    return { success: false }
  }

  const currentlySelectedGroup = await groupsCollection.findOne({ selected: true })

  const isToggle = currentlySelectedGroup && (currentlySelectedGroup._id.toString() === groupId)

  await groupsCollection.findOneAndUpdate({ selected: true }, { $unset: { selected: true } })

  if (!isToggle) {
    await groupsCollection.findOneAndUpdate({ _id: new ObjectID(groupId) }, { $set: { selected: true } })
  }

  const selectedGroup = {
    ...omit(group, '_id'),
    id: group._id,
    selected: !isToggle,
    userCount: await getGroupUserCount(group, { groupsCollection, messagesCollection })
  }

  return { success: true, group: selectedGroup }
}

export default setSelectedGroup
