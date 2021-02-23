import bcrypt from 'bcryptjs'
import { encode as encodeJwt } from 'jwt-simple'

import sendVerificationCode from './sendVerificationCode'

import { secret } from '../../../constants/jwtSecret'

const createUser = async ({ db, username, phoneNumber, password }) => {
  const usersCollection = db.collection('users')

  const passwordHash = bcrypt.hashSync(password, 8)

  const verificationCode = (Math.random() * 10000).toFixed(0)

  await sendVerificationCode(phoneNumber, verificationCode)

  const { insertedId: userId } = await usersCollection.insertOne({ username, password: passwordHash, verificationCode })

  const jwt = encodeJwt({ userId }, secret)

  return { success: true, jwt }
}

export default createUser
