const fs = require('fs')

function requestHandler(req, res) {
    //set headers to thee response header
    const url = req.url;
    const method = req.method
    if(url === '/'){

        // res.setHeader('Content-Type','text/html')

        //write data to the response
        res.write('<html>')
        res.write('<head><title>Enter message</title></head>')
        //form action url where the request should be sent to, send post request to the url
        res.write('<body><form action="/message" method="POST"><input name="message" type="text"><button type="submit">Send</button></form></body>')
        res.write('</html>')
        //end the response, no changing it
        return res.end()

    }
    if(url === '/message' && method === 'POST'){
        //listen to events for request
        const body = []
        req.on('data',(chunk)=>{
            body.push(chunk)
        })

        //fired when the request is parsed(done executing the request)
        return req.on('end', ()=>{
            //buffer chunks
            const parsedBody = Buffer.concat(body).toString()
            const message = parsedBody.split("=")[0]
            //synchronous
            fs.writeFile ('message.txt', message,(err)=>{
                res.statusCode = 302;
                res.setHeader('Location', '/')
                return res.end()
            }) 
            // writeFileSync blocks execution of the next line of code until this is done
        
        })    
    
    }
    res.setHeader('Content-Type','text/html')

    //write data to the response
    res.write('<html>')
    res.write('<head><title>my first app</title></head>')
    res.write('<body><h1>hello from node js</h1></body>')
    res.write('</html>')

    //end the response, no changing it
    res.end()


    //quit the process, quit the serveer
    //process.exit() -> Exited the event loop 
}

// module.exports = {
//   handler:  requestHandler,
//   someText:'hello'
// }

// module.exports.handler = requestHandler
// module.exports.someText = "hello"

exports.handler = requestHandler
exports.someText = 'Hello'


