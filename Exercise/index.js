const http = require('http')

const server = http.createServer((req, res)=>{
    const url = req.url
    const method = req.method
    if(url === '/'){
        res.setHeader('Content-Type','text/html')
        res.write('<html>')
        res.write('<head><title>My App</title></head>')
        res.write('<body><h1>Welcome to my first node app</h1><form action="/create-user" method="post"><input type="text" name="username"><button type="submit">Save</button></form></body>')
        res.write('</html>')
       return res.end()
    }

    if(url === '/users'){
        res.setHeader('Content-Type','text/html')
        res.write('<html>')
        res.write('<head><title>My App</title></head>')
        res.write('<body><ul><li>User 1</li><li>User 2</li><li>User 3</li></ul></body>')
        res.write('</html>')
        return res.end()
    }
    if(url==='/create-user' && method==='POST'){
        const body=[]
        req.on('data', chunk=>{
            body.push(chunk)
        })

        req.on('end', ()=>{
            const buffer = Buffer.concat(body).toString()
            const message = buffer.split('=')[1]
            console.log(message)
           
        })
        res.statusCode = 302
        //set the location to redirect to
        res.setHeader('Location', '/')
        res.end();
        
    }
})

//spin up server
server.listen(3000)