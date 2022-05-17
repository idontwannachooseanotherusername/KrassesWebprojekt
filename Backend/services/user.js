const helper = require('../helper.js');
const UserDao = require('../dao/userDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service User');

serviceRouter.get('/user/get/:id', function(request, response) {
    helper.log('Service User: Client requested one record, id=' + request.params.id);

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.loadById(request.params.id);
        //TODO: Add default picture and banner if path is empty string
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

serviceRouter.put('/user', function(request, response) {
    helper.log('Service User: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.username)) 
        errorMsgs.push('username missing');
    if (helper.isUndefined(request.body.passwort)) 
        errorMsgs.push('passwort missing');
    if (helper.isUndefined(request.body.bio)) 
        request.body.bio = ''
    if (helper.isUndefined(request.body.picturepath)) 
        request.body.picturepath = ''
    if (helper.isUndefined(request.body.bannerpath)) 
        request.body.bannerpath = ''
    if (helper.isUndefined(request.body.countryid)) 
        request.body.countryid = null  //TODO: best solution?
    if (helper.isUndefined(request.body.coins)) 
        request.body.coins = 0
    if (errorMsgs.length > 0) {
        helper.log('Service User: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Creation not possible, data missing: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var result = userDao.update(request.body.id, request.body.username, request.body.newpassword, request.body.oldpassword, request.body.bio, request.picturepath, request.bannerpath, request.countryid, request.coins);
        helper.log('Service User: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service User: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/user/:id', function(request, response) {
    helper.log('Service User: Client requested deletion of record, id=' + request.params.id);

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var obj = userDao.loadById(request.params.id);
        userDao.delete(request.params.id);
        helper.log('Service User: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }));
    } catch (ex) {
        helper.logError('Service User: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;
