const helper = require('../helper.js');
const DifficultyDao = require('../dao/difficultyDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Difficulty');

serviceRouter.get('/difficulty/get/:id', function(request, response) {
    helper.log('Service Difficulty: Client requested one record, id=' + request.params.id);

    const difficultyDao = new DifficultyDao(request.app.locals.dbConnection);
    try {
        var result = difficultyDao.loadById(request.params.id);
        helper.log('Service Difficulty: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Difficulty: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/difficulty/all', function(request, response) {
    helper.log('Service Difficulty: Client requested all records');

    const difficultyDao = new DifficultyDao(request.app.locals.dbConnection);
    try {
        var result = difficultyDao.loadAll();
        helper.log('Service Difficulty: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Difficulty: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/difficulty/exists/:id', function(request, response) {
    helper.log('Service Difficulty: Client requested check, if record exists, id=' + request.params.id);

    const difficultyDao = new DifficultyDao(request.app.locals.dbConnection);
    try {
        var result = difficultyDao.exists(request.params.id);
        helper.log('Service Difficulty: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Difficulty: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;