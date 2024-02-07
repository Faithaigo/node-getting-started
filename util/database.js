const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient;

const uri = "mongodb+srv://aigofaith:WxkHZ0KA7lwk41Xf@cluster0.pkwhwvs.mongodb.net/shop?retryWrites=true&w=majority"

/**
 * Function to store connection to the database
 */
let _db;
const mongoConnect= (callback) =>{
  MongoClient.connect(uri).then(client=>{
    _db = client.db()
    callback()
  console.log('Connected')
}).catch(err=>{
  console.log(err)
  throw err
})
}

/**
 * 
 * @returns access to the database connection
 */
const getDb = () =>{
  if(_db){
    return _db
  }
  throw "No database found"
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb


