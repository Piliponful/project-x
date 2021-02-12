import { ObjectID } from 'mongodb'
import { decode as decodeJwt } from 'jwt-simple'
import { omit } from 'lodash'

import getConnectedClient from '../getConnectedClient'
import { unravelGroup, getUserIdsFromGroupTree } from '../../entities/group'

import { secret } from '../../constants/jwtSecret'

const getMessagesByGroup = async (group, db) => {
  const groupTree = await unravelGroup(group, db)

  const userIds = Array.isArray(groupTree) ? groupTree : getUserIdsFromGroupTree(groupTree)

  return db.messagesCollection.find({ userId: { $in: userIds } })
}

const getMessages = async ({ jwt }) => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const messagesCollection = db.collection('messages')
  const groupsCollection = db.collection('groups')
  const usersCollection = db.collection('users')

  const { userId } = decodeJwt(jwt, secret)

  const user = await usersCollection.findOne({ _id: new ObjectID(userId), verificationCode: { $exists: false } })

  if (!user) {
    return { success: false }
  }

  const group = await groupsCollection.findOne({ selected: true })

  const actions1 = await (group
    ? getMessagesByGroup(group, { messagesCollection, groupsCollection })
    : messagesCollection.find())

  const actions = (await actions1.toArray()).map(i => ({ ...omit(i, '_id'), id: i._id.toString() }))

  const answers = actions.filter(i => i.parentMessageId)
  const questions = actions.filter(i => !i.parentMessageId)

  const questionsWithAnswers = questions
    .map(m => ({
      ...m,
      answersCount: {
        yes: answers.filter(a => m.id === a.parentMessageId && a.content.toLowerCase() === 'yes').length,
        no: answers.filter(a => m.id === a.parentMessageId && a.content.toLowerCase() === 'no').length
      },
      currentUserAnswer: (answers.find(a => a.parentMessageId === m.id && a.userId === userId) || {}).content
    }))

  await connectedClient.close()

  return { success: true, messages: questionsWithAnswers }
}

export default getMessages
