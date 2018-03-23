const _            = require('lodash');
const express      = require('express');
const bodyParser   = require('body-parser');
const { ObjectId } = require('mongodb');

const { mongoose } = require("./db/mongoose");
const { Todo }     = require('./models/todo');
const { User }     = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  })

  todo.save().then(doc => {
    res.status(200).send(doc);
  }, (e) =>{
    res.status(400).send(e);
  })
})

app.get("/todos", (req, res) => {
  Todo.find().then((todos) => {
    res.status(200).send({ todos })
  }, (e) => {
    res.status(400).send(e);
  })
})

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send({error: 'id is not valid'});
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      throw new Error('No Id found');
    }
    res.status(200).send({ todo }) 
  })
  .catch((e) => {
    res.status(400).send({error: e.message});
  })
})

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send({error: 'id is not valid'});
  }

  Todo.findByIdAndRemove(id)
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

app.patch("/todos/:id", (req, res) => {
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

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
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


app.listen(port, () => {
  console.log(`Server is started on port ${port}`);
});

module.exports = { app };



