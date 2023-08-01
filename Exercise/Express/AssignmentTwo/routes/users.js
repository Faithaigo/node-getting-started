const path = require('path')

const dir = require('../util')


const express = require('express')


const router = express.Router()


router.get('/', (req, res, next)=>{
    res.sendFile(path.join(dir, 'views', 'index.html'))
})

router.get('/users', (req, res, next)=>{
    res.sendFile(path.join(dir, 'views', 'users.html'))
})


module.exports = router





