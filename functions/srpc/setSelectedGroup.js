import { ObjectID } from 'mongodb'
import { omit } from 'lodash'
import compose from 'p-compose'

import { getGroupUserCount } from '../../entities/group'
import withUser from '../../entities/db/withUser'

const setSelectedGroup = async ({ db, user, groupId }) => {
  const groupsCollection = db.collection('groups')
  const messagesCollection = db.collection('messages')

  const group = await groupsCollection.findOne({ _id: new ObjectID(groupId) })

  if (!group) {
    throw new Error('Group not found')
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

  return {
    success: true,
    group: selectedGroup
  }
}

export default compose(setSelectedGroup, withUser)
