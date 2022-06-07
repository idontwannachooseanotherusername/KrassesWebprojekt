const helper = require('../helper.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Login check');

serviceRouter.get('/login_check', function(request, response){
    console.log(request.headers);
    var userid = helper.IdFromToken(request.headers.cookie);
    if (userid === undefined || !helper.UserHasAccess(request.headers.cookie)){
        response.status(200).json(helper.jsonMsgOK(false));
    }
    else{
        response.status(200).json(helper.jsonMsgOK(userid));
    }
});

module.exports = serviceRouter;