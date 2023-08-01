const path = require('path')

const express = require('express')

const bodyParser = require('body-parser')

const app = express()

const adminRoutes = require('./routes/admin')

const shopRoutes = require('./routes/shop')




app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))


app.use(shopRoutes)

app.use('/admin',adminRoutes) //filter routes

app.use((req, res, next)=>{
    res.sendFile(path.join(__dirname,  'views', 'page-not-found.html'))
    // res.status(404).send('<h1>Page not found</h1>')
})








app.listen(5000)