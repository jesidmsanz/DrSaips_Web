import { BasicStrategy } from 'passport-http';
import boom from '@hapi/boom';
import bcrypt from 'bcrypt';

const { getUser } = require('@/server/components/users/controller');

export const basicStrategy = new BasicStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  async function (username, password, cb) {
    try {
      const user = await getUser({ username });
      if (!user) {
        return cb(boom.unauthorized(), false);
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return cb(boom.unauthorized(), false);
      }

      user.id = user._id;
      delete user.password;

      return cb(null, user);
    } catch (error) {
      console.log('Basic Error', error);
      return cb(error);
    }
  }
);
