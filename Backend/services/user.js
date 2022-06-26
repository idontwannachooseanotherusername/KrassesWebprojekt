const helper = require('../helper.js');
const UserDao = require('../dao/userDao.js');
const express = require('express');
var serviceRouter = express.Router();
const fileHelper = require('../fileHelper.js');

helper.log('- Service User');

serviceRouter.get('/user/get/:id', function(request, response) {
    helper.log('Service User: Client requested one record, id=' + request.params.id);

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.loadById(request.params.id);
        helper.log('Service User: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service User: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/user/all/', function(request, response) {
    helper.log('Service User: Client requested all records');

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.loadAll();
        helper.log('Service User: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service User: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/user/exists/:id', function(request, response) {
    helper.log('Service User: Client requested check, if record exists, id=' + request.params.id);

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.exists(request.params.id);
        helper.log('Service User: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service User: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/user/unique', function(request, response) {
    helper.log('Service User: Client requested check, if username is unique');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.username)) 
        errorMsgs.push('username missing');

    if (errorMsgs.length > 0) {
        helper.log('Service User: check not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Check not possible. Missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.isunique(request.body.username);
        helper.log('Service User: Check if unique, result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'username': request.body.username, 'unique': result }));
    } catch (ex) {
        helper.logError('Service User: Error checking if unique. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/user/access', function(request, response) {
    helper.log('Service User: Client requested check, if user has access');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.username)) 
        errorMsgs.push('username missing');
    if (helper.isUndefined(request.body.passwort)) 
        errorMsgs.push('password missing');

    if (errorMsgs.length > 0) {
        helper.log('Service User: check not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Check not possible. Missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.hasaccess(request.body.username, request.body.passwort);
        helper.log('Service User: Check if user has access, result=' + result);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service User: Error checking if user has access. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/user', function(request, response) {
    helper.log('Service User: Client requested creation of new record or login');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.username)) 
        errorMsgs.push('username missing');
    if (helper.isUndefined(request.body.password)) 
        errorMsgs.push('passwort missing');
    if (errorMsgs.length > 0) {
        helper.log('Service User: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Creation not possible, data missing: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.create(request.body.username, request.body.password);
        helper.log('Service User: User logged in.');
        // response.cookie('token', result)
        response.status(200).json(helper.jsonMsgOK(result));  // result = Webtoken
    } catch (ex) {
        helper.logError('Service User: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.put('/user/update/:id', function(request, response) {
    helper.log('Service User: Client requested update of id=' + request.params.id);

    if (!helper.UserHasAccess(request.headers.cookie)){
        helper.logError('Service User: User not logged in.');
        response.status(401).json(helper.jsonMsgError('You need to be logged in to do that.'));
        return;
    }

    var errorMsgs=[];
    if (!(helper.isEmpty(request.body.pw_old) || helper.isEmpty(request.body.pw_new) || helper.isEmpty(request.body.pw_new2))){
        if (helper.isEmpty(request.body.pw_old)){
            errorMsgs.push("Old password missing");
        }
        if (helper.isEmpty(request.body.pw_new)){
            errorMsgs.push("New password missing");
        }
        if (helper.isEmpty(request.body.pw_new2)){
            errorMsgs.push("Password confirmation missing");
        }
        if (request.body.pw_new !== request.body.pw_new2){
            errorMsgs.push("Password confirmation does not match");
        }
    }
    if (errorMsgs.length > 0) {
        helper.log('Service User: Creation not possible, data missing or wrong.');
        response.status(400).json(helper.jsonMsgError('Update not possible: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const userDao = new UserDao(request.app.locals.dbConnection);
    var userid = helper.IdFromToken(request.headers.cookie);
    try {
        if (fileHelper.hasUploadedFiles(request)) {
            if(!helper.isEmpty(request.files.profilePic)){
                if (!fileHelper.isImageOkay(request.files.profilePic)){
                    response.status(413).json(helper.jsonMsgError("Error in uploaded files"));
                    return;
                }
                var split = request.files.profilePic.name.split('.');
                var type = "." + split[split.length-1];
                userDao.save_file('../Frontend/data/user_data/' + userid + '/', request.files.profilePic, "profile-picture" + type, userid);
                request.body.picturepath = userid + "/profile-picture" + type;
            }
            if(!helper.isEmpty(request.files.profileBanner)){
                if (!fileHelper.isImageOkay(request.files.profileBanner)){
                    response.status(413).json(helper.jsonMsgError("Error in uploaded files"));
                    return;
                }
                var split = request.files.profilePic.name.split('.');
                var type = "." + split[split.length-1];
                userDao.save_file('../Frontend/data/user_data/' + userid + '/', request.files.profileBanner, "profile-banner" + type, userid);
                request.body.bannerpath = userid + "/profile-banner" + type;
            }
        }

        if((helper.isEmpty(request.body.pw_old))){ // profile data
            var result = userDao.update_data(userid, request.body.username, request.body.bio, request.body.country);
            helper.log('Service User: Record updated, id=' + request.body.id);
        }
        else{  // profile pw
            var result = userDao.update_password(userid, request.body.pw_new, request.body.pw_old);
            helper.log('Service User: Record updated, id=' + request.body.id);
        }
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service User: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/user/', function(request, response) {
    helper.log('Service User: Client requested deletion of record, id=' + request.params.id);

    if (!helper.UserHasAccess(request.headers.cookie)){
        helper.logError('Service Challenge: User not logged in.');
        response.status(401).json(helper.jsonMsgError('You need to be logged in to do that.'));
        return;
    }

    const userDao = new UserDao(request.app.locals.dbConnection);
    userid = helper.IdFromToken(request.headers.cookie);

    try {
        userDao.delete(userid);
        helper.log('Service User: Deletion of record successfull, id=' + userid);
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'userid':  userid}));
    } catch (ex) {
        helper.logError('Service User: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;
