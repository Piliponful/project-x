import { createServer } from 'srpc-framework'
import { createServer as createHttpServer } from 'http'

import saveMessage from './functions/saveMessage'
import getMessages from './functions/getMessages'
import createUser from './functions/createUser'
import verifyUser from './functions/verifyUser'

import createUserValidation from './functions/paramsValidation/createUserValidation'
import getMessagesValidation from './functions/paramsValidation/getMessagesValidation'
import saveMessageValidation from './functions/paramsValidation/saveMessageValidation'
import verifyUserValidation from './functions/paramsValidation/verifyUserValidation'

const functions = {
  createUser,
  getMessages,
  saveMessage,
  verifyUser
}

const paramsValidationFunctions = {
  createUser: createUserValidation,
  getMessages: getMessagesValidation,
  saveMessage: saveMessageValidation,
  verifyUser: verifyUserValidation
}

const port = 8080
const onStartText = `Server successfully launched on port ${port}`

const server = createServer({ functions, paramsValidationFunctions, createServer: createHttpServer })

server.listen(port, () => console.log(onStartText))
