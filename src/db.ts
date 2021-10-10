import { MongoClient } from 'mongodb'

const client = new MongoClient(String(process.env.Context))

client.connect()
  .then(() => {
    console.log("Database connection successful")
  })
  .catch(err => {
    console.error("Database connection error")
    console.log(err)
  })

export default client