const request = require('request-promise-native');
const AUTH_ENDPOINT = 'https://api.instagram.com/oauth/access_token';
const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI;
const InstagramFeedAuthResponseCodes = require(
  '../enums/instagram-feed-auth-response-codes.enum'
);
var InstagramFeedAuth = require('../models/instagram-feed-auth.model');


exports.getLatestImages = (req, res) => {
  InstagramFeedAuth.find({}).exec()
    .then(auths => {
      if (auths.length === 0) {
        res.status(500).json({
          error: 'No access token was found.'
        });
      }
      const accessToken = auths[0].access_token;
      const requestOptions = generateGetRecentImagesRequestOptions(
        accessToken,
        req.query.count || 6
      );
      request(requestOptions)
        .then(function(parsedBody) {
          res.status(200).send({
            data: JSON.parse(parsedBody).data
          });
        })
        .catch(function(err) {
          console.log('err: ', err);
          res.status(500).json({
            error: 'Images could not be retrieved from Instagram\'s servers.'
          });
        })
    })
}

exports.requestAccessToken = (req, res) => {
  const code = req.body.code;
  if (!code) {
    res.status(400).send({error: InstagramFeedAuthResponseCodes.CODE_UNDEFINED});
  }
  const requestOptions = generateAccessTokenRequestOptions(code);
  request(requestOptions)
    .then(function(parsedBody) {
      InstagramFeedAuth.find({}).exec()
        .then(auths => {
          // determine if auth data already exists
          if (auths.length === 0) {
            // auth data doesn't already exist, create new entry
            // in DB
            let authSettings = new InstagramFeedAuth(
              JSON.parse(parsedBody)
            );
            authSettings.save(function(err) {
              if (err) {
                // error while saving settings to DB
                res.status(500).json({
                  error: InstagramFeedAuthResponseCodes.SAVE_TO_DB_ERROR
                });
              }

              // successfully saved auth settings to DB,
              // server now has valid access_token
              res.status(204).send();
            });
          }
          parsedBody = JSON.parse(parsedBody);         
          // auth data already exists, retrieve from first element
          // in array of entries found in DB and update its fields
          let authSettings = auths[0];
          authSettings.access_token = parsedBody.access_token;
          authSettings.user = parsedBody.user;
          authSettings.save(function(err) {
            if (err) {
              // error while saving settings to DB
              res.status(500).json({
                error: InstagramFeedAuthResponseCodes.SAVE_TO_DB_ERROR
              });
            }
            
            // successfully updated auth settings in DB,
            // server now has valid access_token
            res.status(204).send();
          });
        });
    })
    .catch(function(err) {
      const responseError = JSON.parse(err.error);
      const message = responseError.error_message
      res.status(500).json({
        error: InstagramFeedAuthResponseCodes.ACCESS_TOKEN_RETRIEVAL_ERROR,
        message
      });
    });
}

generateAccessTokenRequestOptions = (code) => {
  return {
    method: 'POST',
    uri: AUTH_ENDPOINT,
    formData: {
      client_id: INSTAGRAM_CLIENT_ID,
      client_secret: INSTAGRAM_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: INSTAGRAM_REDIRECT_URI,
      code
    },
  }
}

generateGetRecentImagesRequestOptions = (accessToken, count) => {
  const uri = (
    `https://api.instagram.com/v1/users/self/media/recent/` +
    `?access_token=${accessToken}&count=${count || 6}`
  );
  return {
    method: 'GET',
    uri
  };
}