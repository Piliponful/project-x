import { orderBy } from 'lodash'

import getQuestionsBase from './getQuestionsBase'

const getLatestQuestions = async ({ db, user }) => {
  const questionsWithAnswers = await getQuestionsBase({ db, user })

  const orderedQuestions = orderBy(questionsWithAnswers, 'createdAt', 'desc')

  return { success: true, messages: orderedQuestions }
}

export default getLatestQuestions
