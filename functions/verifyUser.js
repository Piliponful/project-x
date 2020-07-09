import { MongoClient } from 'mongodb'
import { decode as decodeJwt } from 'jwt-simple'

import { secret } from '../constants/jwtSecret'

const getConnectedClient = async () => {
  const url = 'mongodb://piliponful:password123@localhost:27017/test'

  const client = await (new MongoClient(url, { useUnifiedTopology: true })).connect()

  return client
}

const verifyUser = async ({ jwt, verificationCode }) => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const usersCollection = db.collection('users')

  const { userId } = decodeJwt(jwt, secret)

  const user = await usersCollection.findOne({ _id: userId, verificationCode })

  if (user) {
    await usersCollection.updateOne({ _id: userId }, { $unset: { verificationCode } })

    await connectedClient.close()

    return { success: true }
  } else {
    return { success: false }
  }
}

export default verifyUser
