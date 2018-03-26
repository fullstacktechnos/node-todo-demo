const jwt           = require("jsonwebtoken");
const { ObjectId }  = require('mongodb');
const { Todo }      = require('../../models/todo');
const { User }      = require('../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
  _id: userOneId,
  email: 'test@gmail.com',
  password: 'test123!',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userOneId, access: 'auth'}, process.env.JWT_SECRET)
  }]
},{
  _id: userTwoId,
  email: 'test1@gmail.com',
  password: 'test1234!',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userTwoId, access: 'auth'}, process.env.JWT_SECRET)
  }]
}];

const todos = [{
  _id: new ObjectId(),
  text: "first test todo",
  _creator: userOneId
},{
  _id: new ObjectId(),
  text: "second test todo",
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}];

const populateTodos = done => {
  Todo.remove({})
  .then(() => {
    return Todo.insertMany(todos);
  })
  .then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let promise = [];

    const userOne = new User(users[0]);
    promise.push(userOne.save());

    const userTwo = new User(users[1]);
    promise.push(userTwo.save());

    return Promise.all(promise);
  })
  .then(() =>  done());

}


module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}