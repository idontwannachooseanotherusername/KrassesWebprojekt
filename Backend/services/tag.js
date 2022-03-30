const helper = require('../helper.js');
const TagDao = require('../dao/tagDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Tag');

serviceRouter.get('/tag/get/:id', function(request, response) {
    helper.log('Service Tag: Client requested one record, id=' + request.params.id);

    const tagDao = new TagDao(request.app.locals.dbConnection);
    try {
        var result = tagDao.loadById(request.params.id);
        helper.log('Service Tag: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Tag: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/tag/all/', function(request, response) {
    helper.log('Service Tag: Client requested all records');

    const tagDao = new TagDao(request.app.locals.dbConnection);
    try {
        var result = tagDao.loadAll();
        helper.log('Service Tag: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Tag: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/tag/exists/:id', function(request, response) {
    helper.log('Service Tag: Client requested check, if record exists, id=' + request.params.id);

    const tagDao = new TagDao(request.app.locals.dbConnection);
    try {
        var result = tagDao.exists(request.params.id);
        helper.log('Service Tag: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Tag: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;