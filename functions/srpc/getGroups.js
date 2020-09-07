import { decode as decodeJwt } from 'jwt-simple'
import { omit } from 'lodash'
import { ObjectID } from 'mongodb'

import getConnectedClient from '../getConnectedClient'

import { secret } from '../../constants/jwtSecret'

const getGroups = async ({ jwt }) => {
  const connectedClient = await getConnectedClient()

  const db = connectedClient.db()

  const usersCollection = db.collection('users')
  const groupsCollection = db.collection('groups')

  const { userId } = decodeJwt(jwt, secret)

  const user = await usersCollection.findOne({ _id: new ObjectID(userId), verificationCode: { $exists: false } })

  if (!user) {
    return { success: false }
  }

  const groups = (await groupsCollection.find().toArray()).map(i => ({ ...omit(i, '_id'), id: i._id }))

  await connectedClient.close()

  return { success: true, groups }
}

export default getGroups
