const path = require('path');

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('./timeline');
  }
  next();
}

const isLoggedInTwo = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
    
module.exports = function(app, passport) { 
  app.get('/', isLoggedIn, (req, res) => {
    res.sendFile('/Users/Abe/git_codestates/projectOne/client/dist/index.html');
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/timeline',
    failureRedirect : '/',
    failureFlash : true,
  }));

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/timeline',
    failureRedirect : '/',
    failureFlash : true,
  }));

  app.get('/timeline', isLoggedInTwo, (req, res) => {
    console.log('signup')
    res.sendFile('/Users/Abe/git_codestates/projectOne/client/src/timeline.html');
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};

