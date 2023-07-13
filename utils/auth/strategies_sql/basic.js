const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const { getUser, getRoles } = require('../../../components/users/controller');

passport.use(
  new BasicStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async function(username, password, cb) {
      console.log('BasicStrategy');
      try {
        console.log('username', username);
        console.log('password', password);
        const user = await getUser({ username });
        console.log('basic user', user);
        if (!user) {
          return cb(boom.unauthorized(), false);
        }

        if (!(await bcrypt.compare(password, user.password))) {
          return cb(boom.unauthorized(), false);
        }

        delete user.password;

        user.roles = await getRoles({ username });

        return cb(null, user);
      } catch (error) {
        console.log('Basic Error', error);
        return cb(error);
      }
    }
  )
);
