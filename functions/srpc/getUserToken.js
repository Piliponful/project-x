import bcrypt from 'bcryptjs'
import { encode as encodeJwt } from 'jwt-simple'

import { secret } from '../../constants/jwtSecret'

const getUserToken = async ({ db, username, password }) => {
  const usersCollection = db.collection('users')

  const user = await usersCollection.findOne({ username })

  if (!user) {
    throw new Error('User not found')
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new Error('Passwords doesn\'t match')
  }

  const jwt = encodeJwt({ userId: user._id }, secret)

  return { success: true, jwt }
}

export default getUserToken
