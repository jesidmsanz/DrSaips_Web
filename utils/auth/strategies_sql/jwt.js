const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');

const { getUser, getRoles } = require('../../../components/users/controller');
const { config } = require('../../../config');

passport.use(
  new Strategy(
    {
      secretOrKey: config.authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async function(tokenPayload, cb) {
      try {
        // console.log('tokenPayload', tokenPayload);
        const { username } = tokenPayload;
        const user = await getUser({ username });

        if (!user) {
          return cb(boom.unauthorized(), false);
        }

        delete user.password;

        user.roles = await getRoles({ username });

        return cb(null, { ...user, scopes: tokenPayload.scopes });
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);
