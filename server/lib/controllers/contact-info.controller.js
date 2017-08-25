var jwt = require('jsonwebtoken');
const JRSECRET = process.env.JRSECRET;

var ContactInfo = require('../models/contact-info.model');

exports.createContactInfo = (req, res) => {
  var token = req.headers.authorization;
  jwt.verify(token, JRSECRET, (err, decoded) => {
    if (err) {
      res.status(401).send();
    } else {
      var contactInfo = new ContactInfo(req.body);
      contactInfo.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.json({
            message: 'contact info creation saved',
            data: contactInfo,
          });
        }
      });
    }
  });
}

exports.updateContactInfo = (req, res) => {
  var token = req.headers.authorization;
  jwt.verify(token, JRSECRET, (err, decoded) => {
    if (err) {
      res.status(401).send();
    } else {
      ContactInfo.findById(req.params.contact_info_id, (err, contactInfo) => {
        if (err) {
          res.send(err);
        } else {
          contactInfo = req.body;
          contactInfo.save((err) => {
            if (err) {
              res.send(err);
            } else {
              res.json({ data: contactInfo });
            }
          });
        }
      });
    }
  });
}

exports getContactInfo = (req, res) => {
  ContactInfo.find((err, contactInfo) => {
    if (err) {
      res.send(err);
    } else {
      if (contactInfo[0]) {
        res.json(contactInfo);
      } else {
        res.json([]);
      }
    }
  });
}
