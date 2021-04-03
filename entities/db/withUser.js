import { decode as decodeJwt } from 'jwt-simple'
import { omit } from 'lodash'

import { ObjectID } from 'mongodb'

import { secret } from '../../constants/jwtSecret'

const checkAndPassUser = async ({ db, jwt, ...params }) => {
  const usersCollection = db.collection('users')

  const { userId } = decodeJwt(jwt, secret)

  const user = await usersCollection.findOne({ _id: new ObjectID(userId), verificationCode: { $exists: false } })

  if (!user) {
    throw new Error('User not found')
  }

  return { ...params, db, user: { ...omit(user, '_id'), id: user._id } }
}

export default checkAndPassUser
