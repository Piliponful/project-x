import { ObjectID } from 'mongodb'
import { decode as decodeJwt } from 'jwt-simple'
import { omit, orderBy } from 'lodash'

import { getMessagesByGroup } from '../group'

import { secret } from '../../constants/jwtSecret'

const getMostAnsweredQuestions = async ({ db, jwt }) => {
  const messagesCollection = db.collection('messages')
  const groupsCollection = db.collection('groups')
  const usersCollection = db.collection('users')

  const { userId } = decodeJwt(jwt, secret)

  const user = await usersCollection.findOne({ _id: new ObjectID(userId), verificationCode: { $exists: false } })

  if (!user) {
    return { success: false }
  }

  const group = await groupsCollection.findOne({ selected: true })

  const getActionsByQuery = query => group
    ? getMessagesByGroup({ messagesCollection, groupsCollection }, group, query)
    : messagesCollection.find(query).toArray()

  const omitId = arr => arr.map(i => ({ ...omit(i, '_id'), id: i._id.toString() }))

  const answers = omitId(await getActionsByQuery({ parentMessageId: { $ne: null } }))
  const questions = omitId(await getActionsByQuery({ parentMessageId: { $eq: null } }))

  const questionsWithAnswers = questions
    .map(m => ({
      ...m,
      answersCount: {
        yes: answers.filter(a => m.id === a.parentMessageId && a.content.toLowerCase() === 'yes').length,
        no: answers.filter(a => m.id === a.parentMessageId && a.content.toLowerCase() === 'no').length
      },
      currentUserAnswer: (answers.find(a => a.parentMessageId === m.id && a.userId === userId) || {}).content
    }))

  const orderedQuestions = orderBy(questionsWithAnswers, i => i.answersCount.yes + i.answersCount.no, 'desc')

  return { success: true, messages: orderedQuestions }
}

export default getMostAnsweredQuestions