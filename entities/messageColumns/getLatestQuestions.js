import { orderBy } from 'lodash'

import getQuestionsBase from './getQuestionsBase'

const getLatestQuestions = async ({ db, jwt }) => {
  const questionsWithAnswers = await getQuestionsBase({ db, jwt })

  const orderedQuestions = orderBy(questionsWithAnswers, 'createdAt', 'desc')

  return { success: true, messages: orderedQuestions }
}

export default getLatestQuestions
