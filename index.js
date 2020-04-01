const { createHttpSrpcServer, defaultCallFunction } = require('srpc-framework')

const functions = { add: ({ a, b }) => a + b }

const port = 8080
const onStartText = `Server successfully launched on port ${port}`

createHttpSrpcServer({ port, onStartText, functions, callFunction: defaultCallFunction })
