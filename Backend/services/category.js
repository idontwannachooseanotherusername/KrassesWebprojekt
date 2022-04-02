const helper = require('../helper.js');
const CategoryDao = require('../dao/categoryDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Category');

serviceRouter.get('/category/get/:id', function(request, response) {
    helper.log('Service Category: Client requested one record, id=' + request.params.id);

    const categoryDao = new CategoryDao(request.app.locals.dbConnection);
    try {
        var result = categoryDao.loadById(request.params.id);
        helper.log('Service Category: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Category: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/category/all', function(request, response) {
    helper.log('Service Category: Client requested all records');

    const categoryDao = new CategoryDao(request.app.locals.dbConnection);
    try {
        var result = categoryDao.loadAll();
        helper.log('Service Category: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Category: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/category/exists/:id', function(request, response) {
    helper.log('Service Category: Client requested check, if record exists, id=' + request.params.id);

    const categoryDao = new CategoryDao(request.app.locals.dbConnection);
    try {
        var result = categoryDao.exists(request.paramCountrys.id);
        helper.log('Service Category: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Category: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;