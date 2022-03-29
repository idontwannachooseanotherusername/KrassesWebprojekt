const helper = require('../helper.js');
const ChallengeDao = require('../dao/challengeDao.js');
const express = require('express');
const req = require('express/lib/request');
var serviceRouter = express.Router();

helper.log('- Service Challenge');

serviceRouter.get('/challenge/get/:id', function(request, response) {
    helper.log('Service Challenge: Client requested one record, id=' + request.params.id);

    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.loadById(request.params.id);
        helper.log('Service Challenge: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challenge: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/challenge/all/', function(request, response) {
    helper.log('Service Challenge: Client requested all records');

    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.loadAll();
        helper.log('Service Challenge: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challenge: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/challenge/exists/:id', function(request, response) {
    helper.log('Service Challenge: Client requested check, if record exists, id=' + request.params.id);

    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.exists(request.params.id);
        helper.log('Service Challenge: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Challenge: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/challenge', function(request, response) {
    helper.log('Service Challenge: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.challengename)) 
        errorMsgs.push('name missing');
    if (helper.isUndefined(request.body.description)) 
        request.body.description = '';
    if (helper.isUndefined(request.body.difficulty)) 
        errorMsgs.push('difficulty missing');
    if (!helper.isNumeric(request.body.solution)) 
        errorMsgs.push('solution missing');
    if (errorMsgs.length > 0) {
        helper.log('Service Challenge: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Creation not possible, missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    // Set current time as creationtime
    request.body.creationdate = new Date().toLocaleString();

    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.create(request.body.challengename, request.body.difficulty, request.body.description, request.body.creationdate, request.body.solution);
        helper.log('Service Challenge: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challenge: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.put('/challenge', function(request, response) {
    helper.log('Service Challenge: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.challengename)) 
        errorMsgs.push('name missing');
    if (helper.isUndefined(request.body.description)) 
        request.body.description = '';
    if (helper.isUndefined(request.body.difficulty)) 
        errorMsgs.push('difficulty missing');
    if (!helper.isNumeric(request.body.solution)) 
        errorMsgs.push('solution missing');
    if (errorMsgs.length > 0) {
        helper.log('Service Challenge: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Creation not possible, missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.update(request.body.challengename, request.body.difficulty, request.body.description, request.body.creationdate, request.body.solution);
        helper.log('Service Challenge: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challenge: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/challenge/:id', function(request, response) {
    helper.log('Service Challenge: Client requested deletion of record, id=' + request.params.id);

    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    try {
        var obj = challengeDao.loadById(request.params.id);
        challengeDao.delete(request.params.id);
        helper.log('Service Challenge: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'deleted': true, 'entry': obj }));
    } catch (ex) {
        helper.logError('Service Challenge: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;