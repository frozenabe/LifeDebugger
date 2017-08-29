const User = require('./models/user');

// Complete each of the following controller methods
exports.createOne = (req, res) => {
  const { Email, Password } = req.body;
  console.log(req.body)
  User.findOne({
    number,
  })
    .then((user) => {
      console.log(user)
      if (user) {
        console.log('user already exist!', user)
        return res.sendStatus(200)
      }

      const newUser = new User({ Email, Password });
      return newUser.save()
        .then(() => res.sendStatus(200));
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

exports.retrieve = (req, res) => {
  User.find((err, user) => {
    if (err) {
      throw err;
    } 
    res.json(user);
  });
};

exports.retrieveOne = (req, res) => {  
  User.findOne({
    number: req.params.Email,
  })
    .then((user) => {
      if (user) {
        return res.json(user);
      }

      console.log('doesnt exist');
      res.sendStatus(404);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

exports.updateOne = (req, res) => {
  const { Email, Password } = req.params;
  console.log(req.params)
  User.findOne({
    Email,
  })
    .then((user) => {
      user.Email = Email || user.Email;
      user.Password = Password || user.Password;

      return user.save()
        .then(() => res.sendStatus(200));
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

exports.delete = (req, res) => {
  User.find()
    .then(users => {
      User.remove({})
      .then(() => {
        res.send(users)
      })
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

exports.deleteOne = (req, res) => {
  User.findOne({
    number: req.params.Email,
  })
    .then((users) => {
      User.remove({
        number: req.params.Email,
      })
      .then(() => {
        res.send(users)
      })
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};
