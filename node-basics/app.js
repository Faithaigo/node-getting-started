const http = require('http')

const routes =  require('./routes')


// create web servers

const server = http.createServer(routes.handler)

//listen to requests on a port
server.listen(5000) 