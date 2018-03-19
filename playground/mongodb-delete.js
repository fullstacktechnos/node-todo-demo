const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connect to Mongo DB");
  }

  console.log("Succesfully Connected to MongoDb Server");
  const db = client.db("TodoApp");

  //delete many
  //   db.collection('Todos').deleteMany({ text: 'Shopping'})
  //   .then((result) => {
  //     console.log(result);
  //   })

  //delete one
  //   db.collection('Todos').deleteOne({ text: 'Shopping'})
  //   .then((result) => {
  //     console.log(result.result);
  //   })

  //find one and delete
  //   db.collection('Todos').findOneAndDelete({ completed: false})
  //   .then(result => {
  //     console.log(result);
  //   })

  //   db.collection('Users').deleteMany({ name: 'Raja'})
  //   .then(result => {
  //       console.log(result.result);
  //   })

  //   db.collection('Users').findOneAndDelete({
  //     _id: new ObjectID('5aafb18919862b0054ed3917')
  //   })
  //   .then(result => {
  //     console.log(result);
  //   })

  //client.close();
});
