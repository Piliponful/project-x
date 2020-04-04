import { createHttpSrpcServer, defaultCallFunction } from 'srpc-framework'

import saveMessage from './functions/saveMessage'

const functions = { saveMessage }

const port = 8080
const onStartText = `Server successfully launched on port ${port}`

createHttpSrpcServer({ port, onStartText, functions, callFunction: defaultCallFunction })
