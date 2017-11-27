const JRSECRET = process.env.JRSECRET;
const jwt = require('jsonwebtoken');
var UserPreferences = require('../models/user-preferences.model');


exports.updateUserPreferences = (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, JRSECRET, 
    (err, decoded) => {
      if (err) {
        res.status(401).send();
      } else {
        if (!req.body.itemsPerPage) {
          res.status(400).send();
        }
        const uid = decoded.uid;
        UserPreferences.findOne({
          userId: uid
        }, function(err, userPreferences) {
          if (err) {
            res.status(500).json({
              err
            });
          }
          if (!userPreferences) {
            userPreferences = new UserPreferences({
              userId: uid
            });
          }
          userPreferences.itemsPerPage = req.body.itemsPerPage;
          userPreferences.save(function(err) {
            if (err) {
              res.status(500).json({
                err
              });
            }
            res.status(200).send({data: userPreferences});
          })
        });
      }
    }
  );
}

exports.getUserPreferences = (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, JRSECRET,
    (err, decoded) => {
      if (err) {
        res.status(401).send();
      }
      UserPreferences.findOne({
        userId: decoded.uid
      }, function(err, userPreferences) {
        if (err) {
          res.status(500).json({err});
        }
        if (!userPreferences) {
          userPreferences = new UserPreferences({
            userId: decoded.uid,
            itemsPerPage: 4,
          });
          userPreferences.save(function(err) {
            if (err) {
              res.status(500).json({err});
            }
            res.status(200).send({data: userPreferences});
          });
        } else {
          res.status(200).send({data: userPreferences});          
        }
      });
    }
  );
}