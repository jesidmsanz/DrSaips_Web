const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');

const { getUser } = require('../../../server/components/users/controller');
const config = require('../../../server/configEnv/index');

passport.use(
  new Strategy(
    {
      secretOrKey: config.authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async function (tokenPayload, cb) {
      try {
        // console.log('tokenPayload', tokenPayload);
        const { username } = tokenPayload;
        const user = await getUser({ username });

        if (!user) {
          return cb(boom.unauthorized(), false);
        }

        user.id = user._id;
        delete user.password;

        return cb(null, { ...user, scopes: tokenPayload.scopes });
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);
