const expect = require("expect");
const request = require("supertest");
const { ObjectId } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");

const { todos, populateTodos, users, populateUsers } = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

// Todos TCs
describe("POST /todos", () => {
  it("should create a new todo", done => {
    const text = "Test Todo";

    request(app)
      .post("/todos")
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should not create todo with invalid body", done => {
    request(app)
      .post("/todos")
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(err => done(err));
      });
  });
});

describe("GET /todos", () => {
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  it("should return a todo doc", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should return a 404 if todo not found", done => {
    let hexId = new ObjectId().toHexString();
    request(app)
      .get(`/todos/${hexId} + 'test'}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .expect(res => {
        expect(res.body.error).toBe("id is not valid");
      })
      .end(done);
  });

  it("should return a 400 if todo not found", done => {
    let hexId = new ObjectId().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .expect(res => {
        expect(res.body.error).toBe("No Id found");
      })
      .end(done);
  });

  it("should not return a todo doc created by other user", done => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  
  it("should remove a todo", done => {
    const hexId = todos[1]._id.toHexString()

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toBe(null);
            done();
          })
          .catch(err => done(err));
      });
  });

  it("should not remove a todo", done => {
    const hexId = todos[0]._id.toHexString()

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId)
          .then(todo => {
            expect(todo).not.toBe(null);
            done();
          })
          .catch(err => done(err));
      });
  });

  it("should return 404 if todo not found", done => {
    const id = new ObjectId().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .expect(res => {
        expect(res.body.error).toBe("no id found");
      })
      .end(done);
  });

  it("should return 404 if id is invalid", done => {
    request(app)
      .delete(`/todos/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .expect(res => {
        expect(res.body.error).toBe("id is not valid");
      })
      .end(done);
  });
});

describe("UPDATE /todos/:id", () => {

  it("should update the todo", done => {
    const id = todos[0]._id.toHexString();
    const text = "New text fr todo";
    const completed = true;

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text,
        completed
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeGreaterThan(0);
      })
      .end(done);
  });

  it("should update the todo", done => {
    const id = todos[0]._id.toHexString();
    const text = "New text fr todo";
    const completed = true;

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text,
        completed
      })
      .expect(404)
      .end(done);
  });

  it("should clear completedAt when todo is not completed", done => {
    const id = todos[1]._id.toHexString();
    const text = "New text fr todo";
    const completed = false;

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text,
        completed
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });
});

// Users Tcs
describe("GET /users/me", () => {
  it("should return user if authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });
  it("should return 401 if not authenticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        expect(res.body.error).toBe("unauthorised");
      })
      .end(done);
  });
});

describe("POST /users/", () => {
  it("should create user", done => {
    const email = "test999@gmail.com";
    const password = "test999!";

    request(app)
      .post("/users/")
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) return done(err);

        User.findOne({ email })
        .then(user => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        })
        .catch(e => done(e));
      });
  });

  it('should return validation error if request invalid', (done) => {

    const email = "test999";
    const password = "test999!";

    request(app)
      .post("/users/")
      .send({ email, password })
      .expect(400)
      .end(done);
  });
  it('should rnot create user if email in use', (done) => {

    const email = users[0].email;
    const password = "test999!";

    request(app)
      .post("/users/")
      .send({ email, password })
      .expect(400)
      .end(done);
  });
});

describe("POST /users/login", () => {

  it("should login user and return auth token", done => {
    const email = users[1].email;
    const password = users[1].password;

    request(app)
      .post('/users/login')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeTruthy();
        expect(res.body.user.email).toBe(email);
      })
      .end((err, res)=> {
        if (err) return done(err);

        User.findById(users[1]._id)
        .then(user => {
          expect(user.tokens[1].token).toBe(res.headers['x-auth']);
          done();
        })
        .catch(e => done(e));
      });
  });

  it("should reject invalid login", done => {
    const email = users[1].email;
    const password = 'abcdefg123@';

    request(app)
      .post('/users/login')
      .send({ email, password })
      .expect(400)
      .expect(res => {
        expect(res.body.error).toBe('Unauthorised');
      })
      .end((err, res) => {
        if (err) return done(err);

        User.findById(users[1]._id)
        .then(user => {
          expect(user.tokens.length).toBe(1);
          done();
        })
        .catch(e => done(e));
      });
  });

});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    const token = users[0].tokens[0].token;
    const id = users[0]._id;

    request(app)
      .delete('/users/me/token')
      .set("x-auth",token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(id)
        .then(user => {
          expect(user.tokens.length).toBe(0);
          done();
        })
        .catch(err => {
          done(err);
        })
      });
  })
})