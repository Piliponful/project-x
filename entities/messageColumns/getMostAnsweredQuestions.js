import { orderBy } from 'lodash'

import getQuestionsBase from './getQuestionsBase'

const getMostAnsweredQuestions = async ({ db, user }) => {
  const questionsWithAnswers = await getQuestionsBase({ db, user })

  const orderedQuestions = orderBy(questionsWithAnswers, i => i.answersCount.yes + i.answersCount.no, 'desc')

  return { success: true, messages: orderedQuestions }
}

export default getMostAnsweredQuestions
