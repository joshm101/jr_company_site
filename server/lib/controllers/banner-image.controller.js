const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const randomstring = require('randomstring');
const path = require('path');
const multer = require('multer');
const JRSECRET = process.env.JRSECRET;

const BannerImage = require('../models/banner-image.model');

let pathOfUploadedImage = ''

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imageId = req.body.imageid;
    if (imageId && imageId !== 'undefined') {
      cb(null, path.resolve(__dirname, `../images/banner_image/${imageId}`));
    } else {
      cb(new Error('The upload handshake failed'));
    }
  },
  filename: (req, file, cb) => {
    const imageId = req.body.imageid;
    // create datetime stamp of format MMDDYYYYhhmmss
    const dateTimeUploaded = new Date().toLocaleString().slice(-24).replace(/\D/g,'').slice(0, 14);

    // generate random string as part of filename
    const randomlyGeneratedString = randomstring.generate(7);

    // regex to be used to find all non alphanumeric sequences (except for period)
    // and replace them with dashes.
    const regex = /[^a-zA-Z0-9.]+/;
    const originalNameNormalized = file.originalname.replace(new RegExp('[^a-zA-Z0-9.]+', 'g'), '-');

    // construct the final filename and call callback
    const constructedFilename = `${dateTimeUploaded}-${randomlyGeneratedString}-${originalNameNormalized}`;    
    pathOfUploadedImage = `images/banner_image/${imageId}/${constructedFilename}`;
    cb(null, constructedFilename);
  }
})

const upload = multer({ storage: storage }).array('fileUpload');

exports.uploadBannerImage = (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, JRSECRET, (err, decoded) => {
    if (err) {
      res.status(401).send();
    } else {
      upload(req, res, (err) => {
        if (err) {
          console.error(err);
          return res.status(401).end(err.toString());
        }
        const imageId = req.body.imageid;
        console.log("imageId: ", imageId);
        BannerImage.findOne({ 'imageId': imageId }, (err, bannerImage) => {
          if (err) {
            res.send(err);
          } else {
            console.log("bannerImage: ", bannerImage);
            bannerImage.image = pathOfUploadedImage;
            bannerImage.save((err) => {
              if (err) {
                res.status(500).end(err.toString());
              } else {
                pathOfUploadedImage = '';
                res.json(bannerImage);
              }
            });
          }
        });
      });
    }
  });
}

exports.createBannerImage = (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, JRSECRET, (err, decoded) => {
    if (err) {
      res.status(401).send();
    } else {
      let bannerImage = new BannerImage({});
      bannerImage.imageId = randomstring.generate(12);
      fs.mkdir(path.resolve(__dirname, '../images/banner_image/' + bannerImage.imageId));
      bannerImage.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.json({
            message: 'banner image creation saved',
            data: bannerImage,
          });
        }
      })
    }
  });
}

exports.updateBannerImage = (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, JRSECRET, (err, decoded) => {
    if (err) {
      res.status(401).send();
    } else {
      BannerImage.findById(req.params.banner_image_id, (err, bannerImage) => {
        if (err) {
          res.send(err);
        } else {
          if (req.body.image !== bannerImage.image) {
            fs.remove(path.resolve(__dirname, `../${bannerImage.image}`), (err) => {
              if (err) {
                res.send(err);
              } else {
                bannerImage.image = '';
                bannerImage.save((err) => {
                  if (err) {
                    res.send(err);
                  } else {
                    res.json({data: bannerImage});
                  }
                })
              }
            });
          } else {
            bannerImage.save((err) => {
              if (err) {
                res.send(err);
              } else {
                res.json({data: bannerImage});
              }
            });
          }
        }
      });
    }
  });
}

exports.getBannerImage = (req, res) => {
  BannerImage.find((err, bannerImage) => {
    if (err) {
      res.send(err);
    } else {
      if(bannerImage[0]) {
        res.json(bannerImage);
      } else {
        res.json([]);
      }
    }
  });
}