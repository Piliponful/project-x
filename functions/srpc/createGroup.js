import { ObjectID } from 'mongodb'
import compose from 'p-compose'

import { getGroupUserCount } from '../../entities/group'
import withUser from '../../entities/db/withUser'

const createGroup = async ({ db, user, messageId, content, name }) => {
  const messagesCollection = db.collection('messages')
  const groupsCollection = db.collection('groups')

  const message = await messagesCollection.findOne({ _id: new ObjectID(messageId) })

  if (!message) {
    return { success: false }
  }

  const group = await groupsCollection.findOne({ messageId, userId: user.id, content })

  if (group) {
    return { success: false }
  }

  const newGroup = { userId: user.id, messageId, content, name, createdAt: Date.now() }

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

export default compose(createGroup, withUser)
