import { omit } from 'lodash'
import compose from 'compose-function'

import { getGroupUserCount } from '../../entities/group'
import checkAndPassUser from '../../entities/user/checkAndPassUser'

const getGroups = async ({ db, jwt }) => {
  const groupsCollection = db.collection('groups')
  const messagesCollection = db.collection('messages')

  const groups = (await groupsCollection.find().sort('createdAt', -1).toArray()).map(i => ({ ...omit(i, '_id'), id: i._id }))

  const groupsWithUserCount = await Promise.all(
    groups.map(async g => ({ ...g, userCount: await getGroupUserCount(g, { groupsCollection, messagesCollection }) }))
  )

  return { success: true, groups: groupsWithUserCount }
}

export default compose(checkAndPassUser, getGroups)
