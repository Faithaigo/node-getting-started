const express = require('express')

const app = express()

app.use((req, res, next)=>{
    console.log('First Middle ware')
    next()
})


app.use('/users',(req, res, next)=>{
    console.log('last Middle ware')
    res.send('<ul><li>User 1</li><li>User 2</li></ul>')
   
})

app.use('/',(req, res, next)=>{
    console.log('First Middle ware')
    res.send('<h1>Hello from my first express app</h1>')
})




app.listen(5000)