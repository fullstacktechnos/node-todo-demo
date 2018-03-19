const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connect to Mongo DB");
  }
  
  console.log("Succesfully Connected to MongoDb Server");
  const db = client.db('TodoApp');

  // db.collection('Todos').find({
  //   _id: new ObjectID('5aafafaacbb644ff85216b9c')
  // })
  // .toArray()
  // .then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // })

  // db.collection('Todos').find().count()
  // .then((count) => {
  //   console.log('Todos Count', count);
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // })

  db.collection('Users').find({ name: 'Raja'})
  .toArray()
  .then(docs => {
    console.log("Users with Name as 'Raja'")
    console.log('Total Count', docs.length);
    console.log(JSON.stringify(docs, undefined, 2 ));
  }, (err) => {
    console.log('Error while fetching user data', err);
  })
  

  //client.close();
});
