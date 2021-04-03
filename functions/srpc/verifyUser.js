import { decode as decodeJwt } from 'jwt-simple'

import { ObjectID } from 'mongodb'

import { secret } from '../../constants/jwtSecret'

const verifyUser = async ({ db, jwt, verificationCode }) => {
  const usersCollection = db.collection('users')

  const { userId } = decodeJwt(jwt, secret)

  const user = await usersCollection.findOne({ _id: new ObjectID(userId), verificationCode })

  if (!user) {
    throw new Error('User not found')
  }

  await usersCollection.updateOne({ _id: new ObjectID(userId) }, { $unset: { verificationCode: '' } })

  return { success: true }
}

export default verifyUser
