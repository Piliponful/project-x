import compose from 'p-compose'
import { ObjectID } from 'mongodb'

import withUser from '../../entities/db/withUser'

const saveMessage = async ({ db, user, content, parentMessageId }) => {
  const messagesCollection = db.collection('messages')

  if (parentMessageId) {
    const responseMessage = await messagesCollection.findOne({ userId: user.id, parentMessageId })

    if (responseMessage) {
      throw new Error('User tries to answer question he already answered')
    }

    const parentMessage = await messagesCollection.findOne({ _id: new ObjectID(parentMessageId) })

    if (parentMessage.userId === user.id) {
      throw new Error('User tries to answer his own question')
    }
  }

  const newMessage = { userId: user.id, content, parentMessageId, createdAt: Date.now() }

  const result = await messagesCollection.insertOne(newMessage)

  const answersCount = newMessage.parentMessageId ? {} : { answersCount: { yes: 0, no: 0 } }

  return {
    success: true,
    message: {
      ...newMessage,
      id: result.insertedId,
      ...answersCount
    }
  }
}

export default compose(saveMessage, withUser)
