const helper = require('../helper.js');
const CountryDao = require('../dao/countryDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Country');

serviceRouter.get('/country/get/:id', function(request, response) {
    helper.log('Service Country: Client requested one record, id=' + request.params.id);

    const countryDao = new CountryDao(request.app.locals.dbConnection);
    try {
        var result = countryDao.loadById(request.params.id);
        helper.log('Service Country: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Country: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/country/all', function(request, response) {
    helper.log('Service Country: Client requested all records');

    const countryDao = new CountryDao(request.app.locals.dbConnection);
    try {
        var result = countryDao.loadAll();
        helper.log('Service Country: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Country: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/country/exists/:id', function(request, response) {
    helper.log('Service Country: Client requested check, if record exists, id=' + request.params.id);

    const countryDao = new CountryDao(request.app.locals.dbConnection);
    try {
        var result = countryDao.exists(request.params.id);
        helper.log('Service Country: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Country: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/country', function(request, response) {
    helper.log('Service Country: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.countryname)) 
        errorMsgs.push('Countryname missing');
    
    if (errorMsgs.length > 0) {
        helper.log('Service Country: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Adding not possible. Missing Data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const countryDao = new CountryDao(request.app.locals.dbConnection);
    try {
        var result = countryDao.create(request.body.countryname);
        helper.log('Service Country: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Country: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put('/country', function(request, response) {
    helper.log('Service Country: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id missing');
    if (helper.isUndefined(request.body.countryname)) 
        errorMsgs.push('Countryname missing');

    if (errorMsgs.length > 0) {
        helper.log('Service Country: Update not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Update not possible, missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const countryDao = new CountryDao(request.app.locals.dbConnection);
    try {
        var result = countryDao.update(request.body.id, request.body.countryname);
        helper.log('Service Country: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Country: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/country/:id', function(request, response) {
    helper.log('Service Country: Client requested deletion of record, id=' + request.params.id);

    const countryDao = new CountryDao(request.app.locals.dbConnection);
    try {
        var obj = countryDao.loadById(request.params.id);
        countryDao.delete(request.params.id);
        helper.log('Service Country: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'deleted': true, 'entry': obj }));
    } catch (ex) {
        helper.logError('Service Country: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;