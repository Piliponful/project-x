import getQuestionsBase from './getQuestionsBase'

const calcPercentage = (x, total) => Math.floor(x / total * 100)

const getUnanimousQuestions = async ({ db, user }) => {
  const questionsWithAnswers = await getQuestionsBase({ db, user })

  const unanimousQuestions = questionsWithAnswers.filter(q => {
    const total = q.answersCount.yes + q.answersCount.no
    const yesPercentage = calcPercentage(q.answersCount.yes, total)

    return yesPercentage <= 1 || yesPercentage >= 99
  })

  return { success: true, messages: unanimousQuestions }
}

export default getUnanimousQuestions
