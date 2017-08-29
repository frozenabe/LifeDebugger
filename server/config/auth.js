const hashUtils = require('../lib/hashUtils');

const createSession = SessionModel => {
  return (req, res, next) => {
    const {
      sessionKey,
    } = req.cookies;
    if (!sessionKey) {
      const newSessionKey = hashUtils.generateHash();
      console.log('쿠키에 세션키 박았음');
      const _end = res.end;
      res.end = function() {
        res.cookie('sessionKey', newSessionKey, {
          domain: 'localhost:4568',
        });
        _end();
      };
      next();
    }
    return SessionModel.query({
      where: {
        sessionKey,
      },
    })
      .fetch({
        withRelated: 'users',
      })
      .then((session) => {
        if (session) {
          req.session = session;
        }
        next();
      });
  };
};

module.exports = createSession;