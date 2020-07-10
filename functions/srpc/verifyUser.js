import { decode as decodeJwt } from 'jwt-simple'

import getConnectedClient from '../getConnectedClient'

import { secret } from '../../constants/jwtSecret'

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