const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');

let b1 = Buffer.from('Tm8gVGhpcyBJcyBQYXRyaWNr', 'base64')

const privatekey = fs.readFileSync(path.join(__dirname,'..','Keys','jwtRS256.key'))
const publickey = fs.readFileSync(path.join(__dirname,'..','Keys','jwtRS256.key.pub'))

let token = jwt.sign({
  "sub": "1234567890",
  "name": "Mary Ham",
  "iat": 1516239022
}, privatekey, { 
  algorithm: 'RS256', 
  // expiresIn: '1h', 
  // header: {
  //   "alg": "HS256",
  //   "typ": "JWT"
  // }
})

// console.log(token)

function tokenMiddleware(request, response, next){
    let token = request.headers.authorization
    console.log(token)
    token = token.slice(7, token.length)
    jwt.verify(token, publickey, {algorithms: ['RS256']}, function(err, decoded) {
        if(err){
            throw err
        }
        else{
            console.log(decoded)
            console.log("middleware");
            next();
        }
    });
}

module.exports = {token, tokenMiddleware}