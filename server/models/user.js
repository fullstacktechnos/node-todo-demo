const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        require: true
      },
      token: {
        type: String,
        require: true
      }
    }
  ]
});

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ["_id", "email"]);
};

// Instance methods, we need this binding so no arrow function
UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = "auth";
  const token = jwt.sign({ _id: user._id.toHexString(), access }, "test123!");

  user.tokens.push({ access, token });

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken= function (token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: { token }
    }
  })
}

// Static method attach to model
UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, "test123!");
  } catch (err) {
    return Promise.reject(err);
  }

  return User.findOne({
    _id: decoded._id,
    "tokens.access": decoded.access,
    "tokens.token": token
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  const User = this;
  return User.findOne({ email }).then( user => {
    if (!user) {
      return Promise.reject({error: 'No user found'});
    }

    return new Promise((resolve, reject) =>{
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          return resolve(user);
        } else {
          return reject('Unauthorised')
        }
      })
    })

  })
}


//Middle wire by mongoose, it will run before saving user
UserSchema.pre("save", function (next) {
  const user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };
