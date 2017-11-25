const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_REDIRECT_URI= process.env.INSTAGRAM_REDIRECT_URI;


exports.getConfig = (req, res) => {
  res.status(200).send({
    data: {
      instagram: {
        clientId: INSTAGRAM_CLIENT_ID,
        redirectUri: INSTAGRAM_REDIRECT_URI,
      }
    }
  });
}