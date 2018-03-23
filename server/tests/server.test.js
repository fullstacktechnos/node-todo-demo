const expect = require("expect");
const request = require("supertest");
const { ObjectId } = require('mongodb');

const { app } = require("./../server");
const { Todo } = require("./../models/todo");

const todos = [
  {
    _id: new ObjectId(),
    text: 'first test todo'
  },
  {
    _id: new ObjectId(),
    text: 'second test todo'
  }
]

beforeEach(done => {
  Todo.remove({})
  .then(() => {
    return Todo.insertMany(todos);
  })
  .then(() =>  done());
})

describe("POST /todos", () => {

  it("should create a new todo", done => {
    const text = "Test Todo";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        })
        .catch((e) => done(e));
      });
  });

  it("should not create todo with invalid body", done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find().then(todos => {
          expect(todos.length).toBe(2);
          done();
        })
        .catch(err => done(err));
      })
  });
});

describe('GET /todos', () => {

  it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(2);
        })
        .end(done);
  })
})

describe('GET /todos/:id', () => {
  it('should return a todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  });

  it('should return a 404 if todo not found', (done) => {
    let hexId = new ObjectId().toHexString();
    request(app)
      .get(`/todos/${hexId} + 'test'}`)
      .expect(404)
      .expect(res => {
        expect(res.body.error).toBe('id is not valid')
      })
      .end(done);
  });

  it('should return a 400 if todo not found', (done) => {
    let hexId = new ObjectId().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(400)
      .expect(res => {
        expect(res.body.error).toBe('No Id found')
      })
      .end(done);
  });

})

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(todos[0]._id.toHexString())
        .then(todo => {
          expect(todo).toBe(null);
          done();
        })
        .catch(err => done(err));
      });
  })

  it('should return 404 if todo not found', (done) => {
    const id = new ObjectId().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .expect(res => {
        expect(res.body.error).toBe('no id found')
      })
      .end(done);
  })

  it('should return 404 if id is invalid', (done) => {
    request(app)
      .delete(`/todos/123`)
      .expect(404)
      .expect(res => {
        expect(res.body.error).toBe('id is not valid')
      })
      .end(done);
  })
})