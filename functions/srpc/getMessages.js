import { omit, difference, union, intersection } from 'lodash'
import { ObjectID } from 'mongodb'

import getConnectedClient from '../getConnectedClient'

const compositionFunctions = {
  difference,
  union,
  intersection
}

const unravelGroup = async ({ messageId, content, groupIdLeft, groupIdRight, compositionType }, db) => {
  if (compositionType) {
    const groupLeft = await db.groupsCollection.findOne({ groupId: groupIdLeft })
    const groupRight = await db.groupsCollection.findOne({ groupId: groupIdRight })

    return { groupLeft: unravelGroup(groupLeft), groupRight: unravelGroup(groupRight), compositionType }
  }

  const messages = (await db.messagesCollection.find({ parentMessageId: messageId, content }).toArray())

  const userIds = messages.map(i => i.userId)

  return userIds
}

const getUserIdsFromGroupTree = ({ groupLeft, groupRight, compositionType }) =>
  compositionFunctions[compositionType](
    Array.isArray(groupLeft) ? groupLeft : getUserIdsFromGroupTree(groupLeft),
    Array.isArray(groupRight) ? groupRight : getUserIdsFromGroupTree(groupRight)
  )

const getMessagesByGroup = async (group, db) => {
  const groupTree = await unravelGroup(group, db)

  const userIds = Array.isArray(groupTree) ? groupTree : getUserIdsFromGroupTree(groupTree)
  const query = { userId: { $in: userIds } }
  const messages = (await db.messagesCollection.find(query).toArray()).map(i => ({ ...omit(i, '_id'), id: i._id }))

  return messages
}

const getMessages = async ({ groupId } = {}) => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const messagesCollection = db.collection('messages')
  const groupsCollection = db.collection('groups')

  const group = groupId ? await groupsCollection.findOne({ _id: new ObjectID(groupId) }) : null

  if (!group) {
    const messages = (await messagesCollection.find().toArray()).map(i => ({ ...omit(i, '_id'), id: i._id }))

    await connectedClient.close()

    return { success: true, messages }
  } else {
    const messages = await getMessagesByGroup(group, { messagesCollection, groupsCollection })

    await connectedClient.close()

    return { success: true, messages }
  }
}

export default getMessages
