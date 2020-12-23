import { createServer } from 'srpc-framework'
import { createServer as createHttpServer } from 'http'

import saveMessage from './functions/srpc/saveMessage'
import getMessages from './functions/srpc/getMessages'
import createUser from './functions/srpc/createUser'
import verifyUser from './functions/srpc/verifyUser'
import createGroup from './functions/srpc/createGroup'
import getGroups from './functions/srpc/getGroups'
import setSelectedGroup from './functions/srpc/setSelectedGroup'

import createUserValidation from './functions/paramsValidation/createUserValidation'
import getMessagesValidation from './functions/paramsValidation/getMessagesValidation'
import saveMessageValidation from './functions/paramsValidation/saveMessageValidation'
import verifyUserValidation from './functions/paramsValidation/verifyUserValidation'
import createGroupValidation from './functions/paramsValidation/createGroupValidation'
import getGroupsValidation from './functions/paramsValidation/getGroupsValidation'
import setSelectedGroupValidation from './functions/paramsValidation/setSelectedGroupValidation'

const functions = {
  createUser,
  getMessages,
  saveMessage,
  verifyUser,
  createGroup,
  getGroups,
  setSelectedGroup
}

const paramsValidationFunctions = {
  createUser: createUserValidation,
  getMessages: getMessagesValidation,
  saveMessage: saveMessageValidation,
  verifyUser: verifyUserValidation,
  createGroup: createGroupValidation,
  getGroups: getGroupsValidation,
  setSelectedGroup: setSelectedGroupValidation
}

const port = 8080
const onStartText = `Server successfully launched on port ${port}`

const server = createServer({ functions, paramsValidationFunctions, createServer: createHttpServer })

server.listen(port, () => console.log(onStartText))
