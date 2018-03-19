const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connect to Mongo DB");
  }

  console.log("Succesfully Connected to MongoDb Server");
  const db = client.db("TodoApp");

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5aafbc7168b852a9e7fba434')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // })
  // .then(result => {
  //   console.log(result)
  // })

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5aafb0e2d57696000d878eea')
  }, {
    $set: {
      name: 'Harry'
    },
    $inc: {
      age: -25
    }
  }, {
    returnOriginal: false
  })
  .then(result => console.log(result))

  //client.close();
});
