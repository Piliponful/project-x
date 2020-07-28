import bcrypt from 'bcryptjs'
import { encode as encodeJwt } from 'jwt-simple'

import getConnectedClient from '../../getConnectedClient'
import sendVerificationCode from './sendVerificationCode'

import { secret } from '../../../constants/jwtSecret'

const createUser = async ({ username, phoneNumber, password }) => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const usersCollection = db.collection('users')

  const passwordHash = bcrypt.hashSync('bacon', 8)

  const verificationCode = (Math.random() * 10000).toFixed(0)

  await sendVerificationCode(phoneNumber, verificationCode)

  const { insertedId: userId } = await usersCollection.insertOne({ username, password: passwordHash, verificationCode })

  await connectedClient.close()

  const jwt = encodeJwt({ userId }, secret)

  return { success: true, jwt }
}

export default createUser
