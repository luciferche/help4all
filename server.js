const express = require('express');
const log = require('morgan')('dev');
const bodyParser = require('body-parser');
const properties = require('./config/config');
var hpp = require('hpp');
const rateLimit = require('express-rate-limit')
const fileUpload = require('express-fileupload');

//firestore
var reportRoutes = require('./routes/report.routes');
var routes = require('./routes/route');
var app = express();
//configure bodyparser

var bodyParserJSON = bodyParser.json();
var bodyParserURLEncoded = bodyParser.urlencoded({extended:true});

//initialise express router
var router = express.Router();


// CORS NOT USED THIS WAY - YET
var cors = require('cors')
var corsOptions = {
  origin: 'https://fisi.rs',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


// enable files upload
//limit file upload size
app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: 25000000 //25mb
  },
  abortOnLimit: true
}));
// configure app.use()
app.use(log);
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);
app.use(express.static('public'))
//protection agaainst HTTP Parameter Pollution attacks
// app.use(hpp);
/* Limit requests from same origin */
if(process.env.NODE_ENV === 'production') {

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  //  apply to all requests
  app.use(limiter);
}
 
// Error handling
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
     res.setHeader("X-Forwarded-Proto", "https");
     res.setHeader("Access-Control-Allow-Credentials", "true");
     res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
     res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
   next();
 });

 
// use express router
app.use('/api',router);
//call nepravilnost routing
reportRoutes(router);
routes(router);

// intialise server
app.listen(properties.PORT, (req, res) => {
    console.log(`Server is running on ${properties.PORT} port.`);
})


// for authentication
//custom method to generate authToken 
// UserSchema.methods.generateAuthToken = function() { 
//   const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('myprivatekey')); //get the private key from the config file -> environment variable
//   return token;
// }
//function to validate user 
// function validateUser(user) {
//   const schema = {
//     name: Joi.string().min(3).max(50).required(),
//     email: Joi.string().min(5).max(255).required().email(),
//     password: Joi.string().min(3).max(255).required()
//   };

//   return Joi.validate(user, schema);
// }

// exports.User = User; 
// exports.validate = validateUser;