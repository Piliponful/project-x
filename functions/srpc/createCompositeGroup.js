import { ObjectID } from 'mongodb'
import compose from 'p-compose'

import { getGroupUserCount } from '../../entities/group'
import withUser from '../../entities/db/withUser'

const createCompositeGroup = async ({ db, user, name, groupIdLeft, groupIdRight, compositionType }) => {
  const groupsCollection = db.collection('groups')
  const messagesCollection = db.collection('messages')

  const group1 = await groupsCollection.findOne({ _id: new ObjectID(groupIdLeft) })
  const group2 = await groupsCollection.findOne({ _id: new ObjectID(groupIdRight) })

  if (!group1 || !group2) {
    return { success: false }
  }

  const newGroup = {
    userId: user.id,
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

export default compose(createCompositeGroup, withUser)
