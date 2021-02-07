import { ObjectID } from 'mongodb'
import { difference, union, intersection } from 'lodash'

const compositionFunctions = {
  difference,
  union,
  intersection
}

export const unravelGroup = async ({ messageId, content, groupIdLeft, groupIdRight, compositionType }, db) => {
  if (compositionType) {
    const groupLeft = await db.groupsCollection.findOne({ _id: new ObjectID(groupIdLeft) })
    const groupRight = await db.groupsCollection.findOne({ _id: new ObjectID(groupIdRight) })

    return { groupLeft: await unravelGroup(groupLeft, db), groupRight: await unravelGroup(groupRight, db), compositionType }
  }

  const messages = await db.messagesCollection.find({ parentMessageId: messageId, content }).toArray()

  const userIds = messages.map(i => i.userId)

  return userIds
}

export const getUserIdsFromGroupTree = ({ groupLeft, groupRight, compositionType }) =>
  compositionFunctions[compositionType](
    Array.isArray(groupLeft) ? groupLeft : getUserIdsFromGroupTree(groupLeft),
    Array.isArray(groupRight) ? groupRight : getUserIdsFromGroupTree(groupRight)
  )
