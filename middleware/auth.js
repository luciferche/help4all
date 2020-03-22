const admin = require('firebase-admin');


/**
 * auth guard middleware checking if token is passed and if it is 
 * authorized Firebase user token
 */
module.exports = function(req, res, next) {

  if(req.path === '') {
    next();
  }
  //get the token from the header if present
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  if(!token) {
    res.status(401).send('Must provide authorization');
    return;
  } else {
     //firebase admin check client token
    admin.auth().verifyIdToken(token)
      .then(function(decodedToken) {
        let uid = decodedToken.uid;
        if(uid) {
          req.uid = uid;
        }
        next();
      }).catch(function(error) {
        res.status(401).send('Invalid token.');
        return;
      });
  }

};