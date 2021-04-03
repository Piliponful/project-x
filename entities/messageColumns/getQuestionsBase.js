import { ObjectID } from 'mongodb'
import { decode as decodeJwt } from 'jwt-simple'
import { omit } from 'lodash'

import { getMessagesByGroup } from '../group'

import { secret } from '../../constants/jwtSecret'

const getQuestionsBase = async ({ db, jwt }) => {
  const messagesCollection = db.collection('messages')
  const groupsCollection = db.collection('groups')
  const usersCollection = db.collection('users')

  const { userId } = decodeJwt(jwt, secret)

  const user = await usersCollection.findOne({ _id: new ObjectID(userId), verificationCode: { $exists: false } })

  if (!user) {
    throw new Error('User not found')
  }

  const group = await groupsCollection.findOne({ selected: true })

  const getActionsByQuery = (query, group) => group
    ? getMessagesByGroup({ messagesCollection, groupsCollection }, group, query)
    : messagesCollection.find(query).toArray()

  const omitId = arr => arr.map(i => ({ ...omit(i, '_id'), id: i._id.toString() }))

  const answers = omitId(await getActionsByQuery({ parentMessageId: { $ne: null } }, group))
  const allAnswers = omitId(await getActionsByQuery({ parentMessageId: { $ne: null } }))
  const questions = omitId(await getActionsByQuery({ parentMessageId: { $eq: null } }, group))

  const questionsWithAnswers = questions
    .map(m => ({
      ...m,
      answersCount: {
        yes: answers.filter(a => m.id === a.parentMessageId && a.content.toLowerCase() === 'yes').length,
        no: answers.filter(a => m.id === a.parentMessageId && a.content.toLowerCase() === 'no').length
      },
      currentUserAnswer: (allAnswers.find(a => a.parentMessageId === m.id && a.userId === userId) || {}).content
    }))

  return questionsWithAnswers
}

export default getQuestionsBase
