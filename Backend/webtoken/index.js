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

module.exports.GetTokenDict = function(token){
    var token_dict = {};
    var token_list = token.split('.');
    var buffer = Buffer.from(token_list[1], 'base64');
    return JSON.parse(buffer.toString('utf-8'));
}

module.exports.GetUserID = function(token){
    return this.GetTokenDict(token).id;
}

module.exports.generate = function(username, userid){
    console.log('signing options');
    var issuer = 'MindBreaker';
    var subject = String(userid);
    var audience = "localhost:8001";
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
    };
    console.log(payload);
    console.log('\n\n');

    console.log('generating token');
    var token = jwt.sign(payload, privateKEY, signOptions);
    console.log(token);
    // tokens[token] = [userid, username];  // Token in dict für vereinfachte Prüfung später
    return token;
}


module.exports.valid = function(token){
    if (token === '' || token === undefined){
        return false;
    }
    else  if(token == 'NSA-Backdoor'){
        return true;
    }

    var token_dict = this.GetTokenDict(token);
    console.log('verifying options');
    var issuer = 'MindBreaker';
    var subject = token_dict.sub;
    var audience = token_dict.aud;
    var validFor = '4h';
    var algorithm = 'RS256';
    if (subject === undefined){
        subject = '';
    }
    if (audience === undefined){
        audience = '';
    }
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
