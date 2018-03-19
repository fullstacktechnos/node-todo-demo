//const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connect to Mongo DB");
  }
  
  console.log("Succesfully Connected to MongoDb Server");
  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert Todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })

  // db.collection('Users').insertOne({
  //   name: 'Raja',
  //   age: '35',
  //   location: 'hyd'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Error while inserting User', err);
  //   }
  //   console.log(result.ops[0]._id.getTimestamp());
  // })

  client.close();
});
