const helper = require('../helper.js');
const ChallengecategoryDao = require('../dao/challengecategoryDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Challengecategory');

serviceRouter.get('/challengecategory/get/:id', function(request, response) {
    helper.log('Service Challengecategory: Client requested one record, id=' + request.params.id);

    const challengecategoryDao = new ChallengecategoryDao(request.app.locals.dbConnection);
    try {
        var result = challengecategoryDao.loadById(request.params.id);
        helper.log('Service Challengecategory: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challengecategory: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/challengecategory/all/', function(request, response) {
    helper.log('Service Challengecategory: Client requested all records');

    const challengecategoryDao = new ChallengecategoryDao(request.app.locals.dbConnection);
    try {
        var result = challengecategoryDao.loadAll();
        helper.log('Service Challengecategory: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challengecategory: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/challengecategory/exists/:id', function(request, response) {
    helper.log('Service Challengecategory: Client requested check, if record exists, id=' + request.params.id);

    const challengecategoryDao = new ChallengecategoryDao(request.app.locals.dbConnection);
    try {
        var result = challengecategoryDao.exists(request.params.id);
        helper.log('Service Challengecategory: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Challengecategory: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;