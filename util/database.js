const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient;

const uri = "mongodb+srv://aigofaith:WxkHZ0KA7lwk41Xf@cluster0.pkwhwvs.mongodb.net/?retryWrites=true&w=majority"

/**
 * Function to access db from app.js
 */
const mongoClient = (callback) =>{
  MongoClient.connect(uri).then(client=>{
    callback(client)
  console.log('Connected')
}).catch(err=>{
  console.log(err)
})
}

module.exports = mongoClient


