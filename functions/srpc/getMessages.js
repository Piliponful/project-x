import { omit } from 'lodash'

import getConnectedClient from '../getConnectedClient'

const getMessages = async () => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const messagesCollection = db.collection('messages')

  const messages = (await messagesCollection.find().toArray()).map(i => ({ ...omit(i, '_id'), id: i._id }))

  await connectedClient.close()

  return { success: true, messages }
}

export default getMessages
