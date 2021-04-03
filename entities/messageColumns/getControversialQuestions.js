import getQuestionsBase from './getQuestionsBase'

const calcPercentage = (x, total) => Math.floor(x / total * 100)

const getMostContraversialQuestions = async ({ db, jwt }) => {
  const questionsWithAnswers = await getQuestionsBase({ db, jwt })

  const contraversialQuestions = questionsWithAnswers.filter(q => {
    const total = q.answersCount.yes + q.answersCount.no
    const yesPercentage = calcPercentage(q.answersCount.yes, total)

    return yesPercentage > 40 && yesPercentage < 60
  })

  return { success: true, messages: contraversialQuestions }
}

export default getMostContraversialQuestions
