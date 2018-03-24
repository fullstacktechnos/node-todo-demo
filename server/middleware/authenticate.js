const {User} = require('../models/user');

const authenticate = (req, res, next) => {
  const token = req.header("x-auth");

  User.findByToken(token)
    .then(user => {
      if (!user) {
        throw new Error();
      }

      req.user = user;
      req.token = token;
      next();
    })
    .catch(err => {
      res.status(401).json({ error: 'unauthorised' });
    });
};

module.exports = {
  authenticate
}