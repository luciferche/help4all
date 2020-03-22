const jwt = require('jsonwebtoken');
const config = require('config');

exports.getToken = function (req, res, next) {
  let validSource = validateSource(req.param('source'));
  if(!validSource) {
    res.status(401).json({error: 'invalid auth source'})
  }

  const token = getTokenForSource(validSource);
  console.log('generated new token ' + token + ' from source ' + validSource);
  res.status(200).json({token: token});

  // saveTokenWithSomeSession()
}
//against attack, for getting new token we can only do it from OUR client apps
function validateSource(source) {
  // console.log( 'source', source);
  if(!source) {
    return null;
  }

  if(source.length == 12) {
    return 'ANDROID';
  } else if(source.length == 11) {
    return 'WEB_RILE';
  } else {
    return null;
  }

}

function getTokenForSource(source, adminToken) {
  const token = jwt.sign({ source: source, adminToken: adminToken }, config.get('myprivatekey')); //get the private key from the config file -> environment variable

  return token;

}