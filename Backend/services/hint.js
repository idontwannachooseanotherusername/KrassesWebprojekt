const helper = require('../helper.js');
const HintDao = require('../dao/challengeDao.js');
const express = require('express');
const req = require('express/lib/request');
var serviceRouter = express.Router();

helper.log('- Service Hint');

serviceRouter.get('/hint/get/:id', function(request, response) {
    helper.log('Service Hint: Client requested one record, id=' + request.params.id);

    const challengeDao = new HintDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.loadById(request.params.id);
        helper.log('Service Hint: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Hint: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/hint/all/', function(request, response) {
    helper.log('Service Hint: Client requested all records');

    const challengeDao = new HintDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.loadAll();
        helper.log('Service Hint: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Hint: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/hint/exists/:id', function(request, response) {
    helper.log('Service Hint: Client requested check, if record exists, id=' + request.params.id);

    const challengeDao = new HintDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.exists(request.params.id);
        helper.log('Service Hint: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Hint: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/hint', function(request, response) {
    helper.log('Service Hint: Client requested creation of new record');

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
        helper.log('Service Hint: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Creation not possible, missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    // Set current time as creationtime
    request.body.creationdate = new Date().toLocaleString();

    const challengeDao = new HintDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.create(request.body.challengename, request.body.difficulty, request.body.description, request.body.creationdate, request.body.solution);
        helper.log('Service Hint: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Hint: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.put('/hint', function(request, response) {
    helper.log('Service Hint: Client requested update of existing record');

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
        helper.log('Service Hint: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Creation not possible, missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const challengeDao = new HintDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.update(request.body.challengename, request.body.difficulty, request.body.description, request.body.creationdate, request.body.solution);
        helper.log('Service Hint: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Hint: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/hint/:id', function(request, response) {
    helper.log('Service Hint: Client requested deletion of record, id=' + request.params.id);

    const challengeDao = new HintDao(request.app.locals.dbConnection);
    try {
        var obj = challengeDao.loadById(request.params.id);
        challengeDao.delete(request.params.id);
        helper.log('Service Hint: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'deleted': true, 'entry': obj }));
    } catch (ex) {
        helper.logError('Service Hint: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;