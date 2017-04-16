var bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

var User = require('../models/user.model');
const JRSECRET = process.env.JRSECRET;

exports.login = function(req, res) {
  var _res = res;

  // retrieve credentials passed
  // in request body
  var credentials = req.body;
  if (credentials !== null) {
    if ((credentials.username && credentials.username !== '') &&
      (credentials.password && credentials.password !== '')) {
      // attempt the login only if credntials are actually provided.
      User.findOne({username: credentials.username}, function(err, user) {
        if (err || user === null) {
          res.status(401).send();
        } else {
          bcrypt.compare(credentials.password, user.password, function(err, res) {
            if (err) {
              // error other than incorrect password
              _res.status(500).send();
            } else {
              if (res) {
                // res is true, correct password, successful login.
                // sign a JWT and send as response to client.
                _res.json(jwt.sign(
                  {
                    admin: user.admin,
                    iat: Math.floor(Date.now() / 1000) - 30,
                    iss: 'jrsite',
                    uid: user._id,
                  }, JRSECRET, { expiresIn: '2h' }
                  )
                ).send();
              } else {
                // incorrect password
                _res.status(401).send();
              }
            }
          });
        }
      });
    } else {
      // no credentials were provided on login attempt.
      res.status(401).send();
    }
  } else {
    res.status(401).send();
  }
}

exports.changePassword = function(req, res) {
  var _res = res;
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;
  var confirmedPassword = req.body.confirmedPassword;
  var token = req.headers.authorization;

  jwt.verify(token, JRSECRET, function(err, decoded) {
    if (err) {
      res.status(401).send(false);
    } else {
      if (newPassword !== confirmedPassword) { 
        res.status(400).send(false);   // passwords do not match
      } else {
        User.findOne({ _id: req.params.uid }, function(err, user) {
          if (err) {
            // wat
            res.status(400).send(false);
          } else {
            bcrypt.compare(oldPassword, user.password, function(err, res) {
              if (err) {
                // wrong password given
                _res.status(401).send(false);
              } else {
                bcrypt.hash(newPassword, saltRounds, function(err, hash) {
                  if (err) {
                    // ISE on hashing error
                    _res.status(500).send(false);
                  } else {
                    // successful password hash, update stored password hash.
                    user.password = hash;
                    user.save(function(err) {
                      if (err) {
                        // ISE on DB save error
                        _res.status(500).send(false);
                      } else {
                        // successful password update
                        _res.status(200).send(true);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
  });
}

exports.checkTokenValidity = function(req, res) {
  var token = req.headers.authorization;
  jwt.verify(token, JRSECRET, function(err, decoded) {
    if (err) {
      // unauthorized
      res.json(false);
    } else {
      res.json(true);
    }
  });
}