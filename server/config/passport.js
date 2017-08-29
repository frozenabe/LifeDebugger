const LocalStrategy = require('passport-local').Strategy;
const User = require('../resources/models/user');

const Passport = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'Email',
    passwordField : 'Password',
    passReqToCallback : true,
  },
  function(req, email, password, done) {
    User.findOne({ 'email': email }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (user) {
        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.generateHash(password);

        newUser.save(function(err) {
          if (err) {
            throw err;
          }
          return done(null, newUser);
        });
      }
    });    
  }));
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'Email',
    passwordField : 'Password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {
    User.findOne({ 'email': email }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'No user found.')); 
      }
      if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      }
      return done(null, user);
    });
  }));
};

module.exports = Passport;