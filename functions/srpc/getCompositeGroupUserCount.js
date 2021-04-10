import { ObjectID } from 'mongodb'
import compose from 'p-compose'

import { getGroupUserCount } from '../../entities/group'
import withUser from '../../entities/db/withUser'

const createCompositeGroup = async ({ db, groupIdLeft, groupIdRight, compositionType }) => {
  const groupsCollection = db.collection('groups')
  const messagesCollection = db.collection('messages')

  const group1 = await groupsCollection.findOne({ _id: new ObjectID(groupIdLeft) })
  const group2 = await groupsCollection.findOne({ _id: new ObjectID(groupIdRight) })

  if (!group1 || !group2) {
    throw new Error('One of groups is not present')
  }

  const newGroup = {
    groupIdLeft,
    groupIdRight,
    compositionType
  }

  return {
    success: true,
    userCount: await getGroupUserCount(newGroup, { groupsCollection, messagesCollection })
  }
}

export default compose(createCompositeGroup, withUser)
