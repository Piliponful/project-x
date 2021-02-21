import { decode as decodeJwt } from 'jwt-simple'
import { ObjectID } from 'mongodb'
import { omit } from 'lodash'

import { getGroupUserCount } from '../../entities/group'

import getMessages from './getMessages'

import { secret } from '../../constants/jwtSecret'

const setSelectedGroup = async ({ db, jwt, groupId }) => {
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

  return {
    success: true,
    group: selectedGroup,
    messages: {
      mostAnswered: (await getMessages({ db, jwt, messageColumn: 'mostAnswered' })).messages,
      unanimous: (await getMessages({ db, jwt, messageColumn: 'unanimous' })).messages,
      latest: (await getMessages({ db, jwt, messageColumn: 'latest' })).messages
    }
  }
}

export default setSelectedGroup
