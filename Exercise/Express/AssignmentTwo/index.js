const path = require('path')

const dir = require('./util')

const express = require('express')

const userRoutes = require('./routes/users')
const app = express()


app.use(userRoutes)
app.use(express.static(path.join(dir, 'public')))


app.listen(5000)