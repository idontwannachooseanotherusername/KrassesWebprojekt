const helper = require('../helper.js');
const ChallengetagDao = require('../dao/challengetagDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Challengetag');

serviceRouter.get('/challengetag/get/:id', function(request, response) {
    helper.log('Service Challengetag: Client requested records, with categoryid=' + request.params.id);

    const challengetagDao = new ChallengetagDao(request.app.locals.dbConnection);
    try {
        var result = challengetagDao.loadByChallengeId(request.params.id);
        helper.log('Service Challengetag: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challengetag: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/challengetag/all/', function(request, response) {
    helper.log('Service Challengetag: Client requested all records');

    const challengetagDao = new ChallengetagDao(request.app.locals.dbConnection);
    try {
        var result = challengetagDao.loadAll();
        helper.log('Service Challengetag: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challengetag: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/challengetag/exists/:id', function(request, response) {
    helper.log('Service Challengetag: Client requested check, if record exists, id=' + request.params.id);

    const challengetagDao = new ChallengetagDao(request.app.locals.dbConnection);
    try {
        var result = challengetagDao.exists(request.params.id);
        helper.log('Service Challengetag: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Challengetag: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;