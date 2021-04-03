import { ObjectID } from 'mongodb'
import { omit } from 'lodash'
import compose from 'compose-function'

import { getGroupUserCount } from '../../entities/group'
import checkAndPassUser from '../../entities/user/checkAndPassUser'

import getMessages from './getMessages'

const setSelectedGroup = async ({ db, user, groupId }) => {
  const groupsCollection = db.collection('groups')
  const messagesCollection = db.collection('messages')

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

  return {
    success: true,
    group: selectedGroup,
    messages: {
      mostAnswered: (await getMessages({ db, user, messageColumn: 'mostAnswered' })).messages,
      unanimous: (await getMessages({ db, user, messageColumn: 'unanimous' })).messages,
      latest: (await getMessages({ db, user, messageColumn: 'latest' })).messages
    }
  }
}

export default compose(checkAndPassUser, setSelectedGroup)
