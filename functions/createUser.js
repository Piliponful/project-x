import { MongoClient } from 'mongodb'
import Twilio from 'twilio'
import bcrypt from 'bcryptjs'
import { encode as encodeJwt } from 'jwt-simple'

const secret = '28087258-1555-481e-8578-aedccdd9df30'

const sendVerificationCode = async (phoneNumber, verificationCode) => {
  const accountSid = 'ACff5c44f7a932acb3f57035070219a430'
  const authToken = '9e7d4ee2bd6ab1fd5157eac84d9097eb'

  const client = Twilio(accountSid, authToken)

  await client.messages
    .create({
      body: `Verification code: ${verificationCode}`,
      from: '+12392562369',
      to: phoneNumber
    })

  return verificationCode
}

const getConnectedClient = async () => {
  const url = 'mongodb://piliponful:password123@localhost:27017/test'

  const client = await (new MongoClient(url, { useUnifiedTopology: true })).connect()

  return client
}

const createUser = async ({ username, phoneNumber, password }) => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const usersCollection = db.collection('users')

  const passwordHash = bcrypt.hashSync('bacon', 8)

  const verificationCode = (Math.random() * 10000).toFixed(0)

  await sendVerificationCode(phoneNumber, verificationCode)

  const result = await usersCollection.insertOne({ username, password: passwordHash, verified: false })

  await connectedClient.close()

  const jwt = encodeJwt({ userId: result.insertedId, verified: false }, secret)

  return { success: true, jwt }
}

export default createUser
