import compose from 'compose-function'

import checkAndPassUser from '../../entities/user/checkAndPassUser'

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

const getMessages = async ({ db, user, messageColumn = 'mostAnswered' }) => {
  const result = await messageColumnToFunc[messageColumn]({ db, user })

  return { ...result, messageColumn }
}

export default compose(checkAndPassUser, getMessages)
