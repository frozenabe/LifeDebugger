const path = require('path');
const DeletedGroup = require('./models/deletedGroup');
const Item = require('./models/item');
const Group = require('./models/group');
const DeletedItem = require('./models/deletedItem');

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
    res.sendFile(path.join(__dirname + '/../../client/index.html'));
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
    res.sendFile(path.join(__dirname + '/../../client/timeline.html'));
  });

  app.get('/init', (req, res) => {
    const email = req.user.email;
    Promise.all([
      DeletedGroup.find({email}),
      Group.find({email}),
      DeletedItem.find({email}),
      Item.find({email}),
    ])
    .then((result) => {
      console.log(result);
      res.send(result);
    })
  });

  app.post('/addItem', (req, res) => {
    console.log(req.body.id)
    const {
      id,
      group,
      title,
      start,
      end,
      tip,
    } = req.body;

    const newItemInfo = {
      itemId: id,
      email: req.user.email,
      group,
      title,
      start,
      end,
      tip,
    };

    console.log(newItemInfo)

    const newItem = new Item(newItemInfo);
    newItem
      .save()
      .then((data) => {
        console.log('Item is saved');
        res.status(200).send('Item added well (DB)');
      })
      .catch(err => {
        throw err
      });
  });

  app.post('/addGroup', (req, res) => {
    const {
      id,
      title,
      tip,
    } = req.body;

    const newGroupInfo = {
      groupId: id,
      email: req.user.email,
      title,
      tip,
    };

    const newGroup = new Group(newGroupInfo);
    newGroup
      .save()
      .then((data) => {
        console.log('well saved');
        res.status(200).send('Group added well (DB)');
      })
      .catch(err => {
        throw err
      });
  });

  app.post('/deleteItem', (req, res) => {
    const { id } = req.body;
    const deleteItemInfo = {
      itemId: id,
      email: req.user.email,
    };

    Item.find(deleteItemInfo)
      .then((item) => {
        const newItemInfo = {
          itemId: item[0].itemId,
          group: item[0].group,
          title: item[0].title,
          start: item[0].start,
          end: item[0].end,
          tip: item[0].tip,
          email: item[0].email,
        };
        item[0].remove();
        const newDeletedItem = new DeletedItem(newItemInfo);
        newDeletedItem
          .save()
          .then((data) => {
            res.status(200).send('Item deleted well (DB)');
          })
          .catch(err => console.log(err));
      })
  });

  app.post('/deleteGroup', (req, res) => {
    const { id } = req.body;
    const email = req.user.email;
    const deleteGroupInfo = {
      groupId: id,
      email,
    };

    Group.find(deleteGroupInfo)
      .then((group) => {

        const newGroupInfo = {
          groupId: group[0].groupId,
          title: group[0].title,
          tip: group[0].tip,
          email: group[0].email,
        };
        group[0].remove();
        const newDeletedGroup = new DeletedGroup(newGroupInfo);
        newDeletedGroup
          .save()
          .then((data) => {
            res.status(200).send('Group deleted well (DB)');
          })
          .catch(err => console.log(err));
      })
  });

  app.post('/updateItemTitle', (req,res) => {
    const { itemId, inputTitleValue} = req.body;
    const email = req.user.email;

    Item.findOneAndUpdate(
      {itemId, email},
      {$set: {
        title: inputTitleValue
      }},
      (err, documents) => {
        if (!err) {
          console.log("Well updated to new group order");
        }
        res.send({
          error: err,
          affected: documents
        });
      }
    );
  });

  app.post('/changeGroupTitle', (req,res) => {
    const { groupId, inputTitleValue } = req.body;
    const email = req.user.email;

    Group.findOneAndUpdate(
      {groupId, email},
      {$set: {
        title: inputTitleValue
      }},
      (err, documents) => {
        if (!err) {
          console.log("Well updated");
        }
        res.send({
          error: err,
          affected: documents
        });
      }
    );
  });

  app.post('/changeGroupOrder', (req,res) => {
    const { id, start, end, group } = req.body;
    const email = req.user.email;

    Item.findOneAndUpdate(
      {itemId: id, email},
      {$set: {
        start,
        end,
        group,
      }},
      (err, documents) => {
        if (!err) {
          console.log("Well updated to new group order");
        }
        res.send({
          error: err,
          affected: documents
        });
      }
    );
  });

  app.post('/resizedItem', (req,res) => {
    const { id, start, end } = req.body;
    const email = req.user.email;

    Item.findOneAndUpdate(
      {itemId: id, email},
      {$set: {
        start,
        end,
      }},
      (err, documents) => {
        if (!err) {
          console.log("Well updated to new group order");
        }
        res.send({
          error: err,
          affected: documents
        });
      }
    );
  });

  app.post('/restoreDeletedItem', (req, res) => {
    const { id, group, title, start, end, tip } = req.body.item;
    const email = req.user.email;

    const newItemInfo = {
      itemId: id,
      group,
      title,
      start,
      end,
      tip,
      email,
    };

    DeletedItem.remove({itemId:id, email})
      .then( ()=> {
        const restoredItem = new Item(newItemInfo);
        restoredItem.save()
        .then((data) => {
          res.status(200).send('Group deleted well (DB)');
        })
        .catch(err => console.log("this is " + err));
      })
      .catch(err => console.log(err));
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};
