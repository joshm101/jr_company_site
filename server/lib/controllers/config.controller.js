const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_REDIRECT_URI= process.env.INSTAGRAM_REDIRECT_URI;
const JRSECRET = process.env.JRSECRET;

var jwt = require('jsonwebtoken');

var Config = require('../models/config.model');

exports.getConfig = (req, res) => {
  Config.findOne({}).exec()
    .then(config => {
      if (!config) {
        // no config exists, create config
        // and populate with defaults
        config = new Config();
        config.save(function(err) {
          if (err) {
            res.status(500).json(err)
          }
          res.status(200).send({data: config});
        });
      } else {
        res.status(200).send({data: config});
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

exports.updateConfig = (req, res) => {
  let token = req.headers.authorization;
  jwt.verify(token, JRSECRET, function(err, decoded) {
    if (err) {
      res.status(401).send();
    } else {
      if (!req.body) {
        res.status(500);
      }
      if (req.body) {
        Config.findOne({}).exec()
          .then(config => {
            config.instagram = req.body.instagram;
            config.itemsPerPage = req.body.itemsPerPage;
            config.save(function(err) {
              if (err) {
                res.status(500).json(err);
              }
              res.status(200).send({data: config});
            })
          })
          .catch(err => {
            res.status(500).json(err);
          });
      }
    }
  });
}