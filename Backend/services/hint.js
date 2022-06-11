const helper = require('../helper.js');
const HintDao = require('../dao/hintDao.js');
const ChallengeDao = require('../dao/challengeDao.js');
const express = require('express');
const req = require('express/lib/request');
var serviceRouter = express.Router();

helper.log('- Service Hint');

serviceRouter.get('/hint/get/:id', function(request, response) {
    helper.log('Service Hint: Client requested one record, id=' + request.params.id);

    const hintDao = new HintDao(request.app.locals.dbConnection);
    try {
        var result = hintDao.loadById(request.params.id);
        helper.log('Service Hint: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Hint: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/hint/get-from-challenge/:hintclass/:challengeid', function(request, response) {
    helper.log('Service Hint: Client requested one record, from challengeid=' + request.params.challengeid);

    if (!helper.UserHasAccess(request.headers.cookie)){
        helper.logError('Service Hint: User not logged in.');
        response.status(401).json(helper.jsonMsgError('You need to be logged in to do that.'));
        return;
    }
    var userid = helper.IdFromToken(request.headers.cookie);

    const hintDao = new HintDao(request.app.locals.dbConnection);
    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    try {
        var result = hintDao.loadByChallengeId(request.params.hintclass,
                                               request.params.challengeid,
                                               userid,
                                               challengeDao.isSolved(userid, request.params.challengeid));
        helper.log('Service Hint: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Hint: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/hint/check/challenge/:id', function(request, response) {
    helper.log('Service Hint: Client requested check by challengeid=' + request.params.id);

    if (!helper.UserHasAccess(request.headers.cookie)){
        helper.logError('Service Hint: User not logged in.');
        response.status(401).json(helper.jsonMsgError('You need to be logged in to do that.'));
        return;
    }

    const hintDao = new HintDao(request.app.locals.dbConnection);
    const challengeDao = new ChallengeDao(request.app.locals.dbConnection)
    var result = challengeDao.loadByIdUnsterilized(request.params.id);
    var userid = helper.IdFromToken(request.headers.cookie);
    var creator = false;
    if (userid == result.user.userid){
        creator = true;
    }

    try {
        var result = hintDao.checkByChallengeId(request.params.id, helper.IdFromToken(request.headers.cookie), creator);
        helper.log('Service Hint: Check hints by challengeid=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK(result));
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

    const hintDao = new HintDao(request.app.locals.dbConnection);
    try {
        var result = hintDao.create(request.body.challengename, request.body.difficulty, request.body.description, request.body.creationdate, request.body.solution);
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

    const hintDao = new HintDao(request.app.locals.dbConnection);
    try {
        var result = hintDao.update(request.body.challengename, request.body.difficulty, request.body.description, request.body.creationdate, request.body.solution);
        helper.log('Service Hint: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Hint: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/hint/:id', function(request, response) {
    helper.log('Service Hint: Client requested deletion of record, id=' + request.params.id);

    const hintDao = new HintDao(request.app.locals.dbConnection);
    try {
        var obj = hintDao.loadById(request.params.id);
        hintDao.delete(request.params.id);
        helper.log('Service Hint: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'deleted': true, 'entry': obj }));
    } catch (ex) {
        helper.logError('Service Hint: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;
