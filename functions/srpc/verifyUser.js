import { encode as encodeJwt } from 'jwt-simple'
import { ObjectID } from 'mongodb'

import { secret } from '../../constants/jwtSecret'

const verifyUser = async ({ db, userId, verificationCode }) => {
  const usersCollection = db.collection('users')

  const user = await usersCollection.findOne({ _id: new ObjectID(userId), verificationCode })

  if (!user) {
    throw new Error('User not found')
  }

  await usersCollection.updateOne({ _id: new ObjectID(userId) }, { $unset: { verificationCode: '' } })

  const jwt = encodeJwt({ userId }, secret)

  return { success: true, jwt }
}

export default verifyUser
