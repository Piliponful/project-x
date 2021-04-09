import bcrypt from 'bcryptjs'
import phone from 'phone'

import sendVerificationCode from './sendVerificationCode'

const createUser = async ({ db, username, phoneNumber, password }) => {
  const phoneNumberValid = phone(phoneNumber)[0]
  const usersCollection = db.collection('users')

  const userWithSameUsername = await usersCollection.countDocuments({ username })

  if (userWithSameUsername) {
    throw new Error('Username already in use')
  }

  const userWithSamePhone = await usersCollection.countDocuments({ phoneNumber: phoneNumberValid })

  if (userWithSamePhone) {
    throw new Error('Phone already in use')
  }

  const passwordHash = bcrypt.hashSync(password, 8)

  const verificationCode = (Math.random() * 10000).toFixed(0)

  await sendVerificationCode(phoneNumberValid, verificationCode)

  const { insertedId: userId } = await usersCollection
    .insertOne({ username, password: passwordHash, phoneNumber: phoneNumberValid, verificationCode })

  return { success: true, userId }
}

export default createUser
