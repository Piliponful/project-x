import { createHttpSrpcServer, defaultCallFunction } from 'srpc-framework'

import saveMessage from './functions/saveMessage'
import getMessages from './functions/getMessages'
import createUser from './functions/createUser'

const functions = {
  saveMessage,
  getMessages,
  createUser
}

const port = 8080
const onStartText = `Server successfully launched on port ${port}`

createHttpSrpcServer({ port, onStartText, functions, callFunction: defaultCallFunction })
