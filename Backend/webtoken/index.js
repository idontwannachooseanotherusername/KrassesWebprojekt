'use strict';

console.log('linking libraries\n\n');
const fs   = require('fs');
const jwt  = require('jsonwebtoken');
const path = require("path"); 

console.log('setting keys');
var privateKEY = fs.readFileSync(path.resolve('./webtoken/private.key'), 'utf8');
var publicKEY = fs.readFileSync(path.resolve('./webtoken/public.key'), 'utf8');

console.log('private key loaded, ' + privateKEY.length + ' bytes');
console.log('public key loaded, ' + publicKEY.length + ' bytes\n\n');

module.exports.generate = function(username, userid){
    console.log('signing options');
    var issuer = 'MindBreaker';
    var subject = username;
    var audience = String(userid);
    var validFor = '4h';
    var algorithm = 'RS256';
    var signOptions = {
        'issuer': issuer,
        'subject': subject,
        'audience': audience,
        'expiresIn': validFor,        // verfallsdatum des Token
        'algorithm': algorithm        // verwendeter algorithmus zum ver/entschlüsseln
    };
    console.log(signOptions);

    console.log('setting payload');
    var payload = {
        'id': userid,
        'loggedIn': true,
        'userName': username
    };
    console.log(payload);
    console.log('\n\n');

    console.log('generating token');
    var token = jwt.sign(payload, privateKEY, signOptions);
    console.log(token);
    return token;
}


module.exports.valid = function(token, username, userid){
    console.log('verifying options');
    var issuer = 'MindBreaker';
    var subject = username;
    var audience = String(userid);
    var validFor = '4h';
    var algorithm = 'RS256';
    var verifyOptions = {
        'issuer': issuer,
        'subject': subject,
        'audience': audience,
        'expiresIn': validFor,
        'algorithms': [algorithm]
    };
    console.log(verifyOptions);
    console.log('\n\n');

    console.log('verifying/decoding token');
    try {
        console.log('decoding token');
        var decodedToken = jwt.verify(token, privateKEY, verifyOptions);
        console.log('token decoded');

        console.log('checking if token still valid')
        if (decodedToken.iat >= decodedToken.exp) {
            console.log('TOKEN IS EXPIRED');
        } else {
            console.log('token is valid');
            return true;
        }   
    } catch (e) {
        console.log('TOKEN NOT VALID');
        return false;
    }
}
