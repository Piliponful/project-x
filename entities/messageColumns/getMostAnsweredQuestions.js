import { orderBy } from 'lodash'

import getQuestionsBase from './getQuestionsBase'

const getMostAnsweredQuestions = async ({ db, jwt }) => {
  const questionsWithAnswers = await getQuestionsBase({ db, jwt })

  const orderedQuestions = orderBy(questionsWithAnswers, i => i.answersCount.yes + i.answersCount.no, 'desc')

  return { success: true, messages: orderedQuestions }
}

export default getMostAnsweredQuestions
