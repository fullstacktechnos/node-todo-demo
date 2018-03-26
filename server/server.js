require('./config/config');

const _            = require('lodash');
const express      = require('express');
const bodyParser   = require('body-parser');
const { ObjectId } = require('mongodb');

const { mongoose } = require("./db/mongoose");
const { Todo }     = require('./models/todo');
const { User }     = require('./models/user');
const { authenticate} = require('./middleware/authenticate');

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })

  todo.save().then(doc => {
    res.status(200).send(doc);
  }, (e) =>{
    res.status(400).send(e);
  })
})

app.get("/todos", authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id })
  .then((todos) => {
    res.status(200).send({ todos })
  }, (e) => {
    console.log(e);
    res.status(400).send(e);
  })
})

app.get("/todos/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send({error: 'id is not valid'});
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
  .then((todo) => {
    if (!todo) {
      throw new Error('No Id found');
    }
    res.status(200).send({ todo }) 
  })
  .catch((e) => {
    res.status(400).send({error: e.message});
  })
})

app.delete("/todos/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send({error: 'id is not valid'});
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
  .then(todo => {
    if (!todo) {
      return res.status(404).send({error: 'no id found'});
    }
    res.status(200).send({ todo }) 
  })
  .catch((e) => {
    res.status(400).send({error: e.message});
  })
})

app.patch("/todos/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectId.isValid(id)) {
    return res.status(404).send({error: 'id is not valid'});
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true})
  .then(todo => {
    if (!todo) {
      return res.status(404).send({error: 'no id found'});
    }

    res.status(200).send({ todo }) 
  })
  .catch((e) => {
    res.status(400).send({error: e.message});
  })
})


app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body)

  user.save()
  .then(() => {
    return user.generateAuthToken();
  })
  .then((token) => {
    res.header('x-auth', token).send(user);
  })
  .catch((e) => {
    res.status(400).send(e);
  })
})

app.post('/users/login', (req, res) => { 
  const body = _.pick(req.body, ['email', 'password']);
  
  if (!body.email && !body.password) {
    res.status(404).json({error: 'please send email and password'})
  }

  let userinfo = {};
  User.findByCredentials(body.email, body.password)
  .then(user => {
    return user.generateAuthToken().then(token => {
      res.header('x-auth', token).send({ user });
    })
  })
  .catch(err => {
    res.status(400).json({error: 'Unauthorised'})
  })

})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
})

app.delete('/users/me/token/', authenticate, (req, res) => { 
  const token = req.token;
 
  req.user.removeToken(req.token)
  .then((result) => {
    res.status(200).send()
  })
  .catch(err => {
    res.status(400).send()
  })

})

app.listen(port, () => {
  console.log(`Server is started on port ${port}`);
});

module.exports = { app };



