const helper = require('../helper.js');
const CategoryDao = require('../dao/categoryDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Category');

serviceRouter.get('/category/get/:id', function(request, response) {
    helper.log('Service Category: Client requested one record, id=' + request.params.id);

    const categoryDao = new CountryDao(request.app.locals.dbConnection);
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

    const categoryDao = new CountryDao(request.app.locals.dbConnection);
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

    const categoryDao = new CountryDao(request.app.locals.dbConnection);
    try {
        var result = categoryDao.exists(request.paramCountrys.id);
        helper.log('Service Category: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Category: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/category', function(request, response) {
    helper.log('Service Category: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.title)) 
        errorMsgs.push('Category title missing');
    
    if (errorMsgs.length > 0) {
        helper.log('Service Category: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Adding not possible. Missing Data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const categoryDao = new CountryDao(request.app.locals.dbConnection);
    try {
        var result = categoryDao.create(request.body.title);
        helper.log('Service Category: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Category: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put('/category', function(request, response) {
    helper.log('Service Category: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id missing');
    if (helper.isUndefined(request.body.title)) 
        errorMsgs.push('Category title missing');

    if (errorMsgs.length > 0) {
        helper.log('Service Category: Update not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Update not possible, missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const categoryDao = new CountryDao(request.app.locals.dbConnection);
    try {
        var result = categoryDao.update(request.body.id, request.body.title);
        helper.log('Service Category: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Category: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/category/:id', function(request, response) {
    helper.log('Service Category: Client requested deletion of record, id=' + request.params.id);

    const categoryDao = new CountryDao(request.app.locals.dbConnection);
    try {
        var obj = categoryDao.loadById(request.params.id);
        categoryDao.delete(request.params.id);
        helper.log('Service Category: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'deleted': true, 'entry': obj }));
    } catch (ex) {
        helper.logError('Service Category: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;