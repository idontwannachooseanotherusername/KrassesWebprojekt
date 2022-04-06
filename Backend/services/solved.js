const helper = require('../helper.js');
const SolvedDao = require('../dao/solvedDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Solved');

serviceRouter.get('/solved/get/:id', function(request, response) {
    helper.log('Service Solved: Client requested one record, id=' + request.params.id);

    const solvedDao = new SolvedDao(request.app.locals.dbConnection);
    try {
        var result = solvedDao.loadById(request.params.id);
        helper.log('Service Solved: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Solved: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/solved/all/', function(request, response) {
    helper.log('Service Solved: Client requested all records');

    const solvedDao = new SolvedDao(request.app.locals.dbConnection);
    try {
        var result = solvedDao.loadAll();
        helper.log('Service Solved: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Solved: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/solved/exists/:id', function(request, response) {
    helper.log('Service Solved: Client requested check, if record exists, id=' + request.params.id);

    const solvedDao = new SolvedDao(request.app.locals.dbConnection);
    try {
        var result = solvedDao.exists(request.params.id);
        helper.log('Service Solved: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Solved: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/solved', function(request, response) {
    helper.log('Service Solved: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.filepath)) 
        errorMsgs.push('file missing');
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id missing');
    if (errorMsgs.length > 0) {
        helper.log('Service Solved: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Creation not possible, missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const solvedDao = new SolvedDao(request.app.locals.dbConnection);
    try {
        var result = solvedDao.create(request.body.filepath, request.body.id);
        helper.log('Service Solved: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Solved: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.put('/solved', function(request, response) {
    helper.log('Service Solved: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.filepath)) 
        errorMsgs.push('file missing');
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id missing');
    if (errorMsgs.length > 0) {
        helper.log('Service Solved: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Creation not possible, missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const solvedDao = new SolvedDao(request.app.locals.dbConnection);
    try {
        var result = solvedDao.create(request.body.filepath, request.body.id);
        helper.log('Service Solved: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Solved: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/solved/:id', function(request, response) {
    helper.log('Service Solved: Client requested deletion of record, id=' + request.params.id);

    const solvedDao = new SolvedDao(request.app.locals.dbConnection);
    try {
        var obj = solvedDao.loadById(request.params.id);
        solvedDao.delete(request.params.id);
        helper.log('Service Solved: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'deleted': true, 'entry': obj }));
    } catch (ex) {
        helper.logError('Service Solved: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;