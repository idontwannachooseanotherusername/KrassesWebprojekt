const helper = require('../helper.js');
const ChallengefileDao = require('../dao/challengefileDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Challengepicture');

serviceRouter.get('/challengefile/get/:id', function(request, response) {
    helper.log('Service Challengepicture: Client requested one record, id=' + request.params.id);

    const challengefileDao = new ChallengefileDao(request.app.locals.dbConnection);
    try {
        var result = challengefileDao.loadById(request.params.id);
        helper.log('Service Challengepicture: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challengepicture: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/challengefile/all/', function(request, response) {
    helper.log('Service Challengepicture: Client requested all records');

    const challengefileDao = new ChallengefileDao(request.app.locals.dbConnection);
    try {
        var result = challengefileDao.loadAll();
        helper.log('Service Challengepicture: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challengepicture: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/challengefile/exists/:id', function(request, response) {
    helper.log('Service Challengepicture: Client requested check, if record exists, id=' + request.params.id);

    const challengefileDao = new ChallengefileDao(request.app.locals.dbConnection);
    try {
        var result = challengefileDao.exists(request.params.id);
        helper.log('Service Challengepicture: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Challengepicture: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/challengefile', function(request, response) {
    helper.log('Service Challengepicture: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.picturepath)) 
        errorMsgs.push('file missing');
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id missing');
    if (errorMsgs.length > 0) {
        helper.log('Service Challengepicture: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Creation not possible, missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const challengefileDao = new ChallengefileDao(request.app.locals.dbConnection);
    try {
        var result = challengefileDao.create(request.body.picturepath, request.body.id);
        helper.log('Service Challengepicture: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challengepicture: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.put('/challengefile', function(request, response) {
    helper.log('Service Challengepicture: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.picturepath)) 
        errorMsgs.push('file missing');
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id missing');
    if (errorMsgs.length > 0) {
        helper.log('Service Challengepicture: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Creation not possible, missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const challengefileDao = new ChallengefileDao(request.app.locals.dbConnection);
    try {
        var result = challengefileDao.create(request.body.picturepath, request.body.id);
        helper.log('Service Challengepicture: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challengepicture: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/challengefile/:id', function(request, response) {
    helper.log('Service Challengepicture: Client requested deletion of record, id=' + request.params.id);

    const challengefileDao = new ChallengefileDao(request.app.locals.dbConnection);
    try {
        var obj = challengefileDao.loadById(request.params.id);
        challengefileDao.delete(request.params.id);
        helper.log('Service Challengepicture: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'deleted': true, 'entry': obj }));
    } catch (ex) {
        helper.logError('Service Challengepicture: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;