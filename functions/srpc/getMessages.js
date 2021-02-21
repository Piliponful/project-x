import getMostAnsweredQuestions from '../../entities/messageColumns/getMostAnsweredQuestions'
import getLatestQuestions from '../../entities/messageColumns/getLatestQuestions'
import getControversialQuestions from '../../entities/messageColumns/getControversialQuestions'
import getUnanimousQuestions from '../../entities/messageColumns/getUnanimousQuestions'

const messageColumnToFunc = {
  mostAnswered: getMostAnsweredQuestions,
  latest: getLatestQuestions,
  controversial: getControversialQuestions,
  unanimous: getUnanimousQuestions
}

const getMessages = async ({ db, jwt, messageColumn = 'mostAnswered' }) => {
  const result = await messageColumnToFunc[messageColumn]({ db, jwt })

  return { ...result, messageColumn }
}

export default getMessages
