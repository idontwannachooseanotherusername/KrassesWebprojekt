const helper = require('../helper.js');
const ChallengeDao = require('../dao/challengeDao.js');
const HintDao = require('../dao/hintDao.js');
const ChallengetagDao = require('../dao/challengetagDao.js');
const express = require('express');
const req = require('express/lib/request');
const UserDao = require('../dao/userDao.js');
var serviceRouter = express.Router();
const fileHelper = require('../fileHelper.js');

helper.log('- Service Challenge');

serviceRouter.get('/challenge/get/unsterilized/:id', function(request, response) {
    helper.log('Service Challenge: Client requested one unsterilized record, id=' + request.params.id);

    if (!helper.UserHasAccess(request.headers.cookie)){
        helper.logError('Service Challenge: User not logged in.');
        response.status(401).json(helper.jsonMsgError('You need to be logged in to do that.'));
        return;
    }

    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.loadByIdUnsterilized(request.params.id);
        var userid = helper.IdFromToken(request.headers.cookie);
        if (userid !== result.user.userid || challengeDao.isSolved(userid, result.challengeid)){
            helper.logError('Service Challenge: User not owner of challenge.');
            response.status(401).json(helper.jsonMsgError('You need to be the challengecreator to do that.'));
            return;
        }
        helper.log('Service Challenge: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challenge: Error loading record by id. Exception occured: ' + ex.message);
        response.status(404).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/challenge/get/:id', function(request, response) {
    helper.log('Service Challenge: Client requested one record, id=' + request.params.id);

    if (!helper.UserHasAccess(request.headers.cookie)){
        helper.logError('Service Challenge: User not logged in.');
        response.status(401).json(helper.jsonMsgError('You need to be logged in to do that.'));
        return;
    }

    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.loadById(request.params.id);
        result.solved = challengeDao.isSolved(helper.IdFromToken(request.headers.cookie), request.params.id);
        helper.log('Service Challenge: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challenge: Error loading record by id. Exception occured: ' + ex.message);
        response.status(404).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/challenge/all/', function(request, response) {
    helper.log('Service Challenge: Client requested all records');

    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.loadAll(helper.IdFromToken(request.headers.cookie));
        helper.log('Service Challenge: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challenge: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/challenge/solutioncheck/:id', function(request, response) {
    helper.log('Service Challenge: Client requested solutioncheck');
    if (!helper.UserHasAccess(request.headers.cookie)){
        helper.logError('Service Challenge: User not logged in.');
        response.status(401).json(helper.jsonMsgError('You need to be logged in to do that.'));
        return;
    }

    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.checkSolution(request.params.id, helper.IdFromToken(request.headers.cookie), request.body.solution);
        helper.log('Service Challenge: Solution checked, machtes: ' + result);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challenge: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/challenge/exists/:id', function(request, response) {
    helper.log('Service Challenge: Client requested check, if record exists, id=' + request.params.id);

    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    try {
        var result = challengeDao.exists(request.params.id);
        helper.log('Service Challenge: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Challenge: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/challenge/', function(request, response) {
    helper.log('Service Challenge: Client requested creation of new record');

    if (!helper.UserHasAccess(request.headers.cookie)){
        helper.logError('Service Challenge: User not logged in.');
        response.status(401).json(helper.jsonMsgError('You need to be logged in to do that.'));
        return;
    }

    var errorMsgs=[];
    if (helper.isUndefined(request.body.challengename))
        errorMsgs.push('name missing');
    if (helper.isUndefined(request.body.categoryid)) 
        request.body.category = 'Other';
    if (helper.isUndefined(request.body.description)) 
        request.body.description = '';
    if (helper.isUndefined(request.body.difficulty)) 
        errorMsgs.push('difficulty missing');
    if (helper.isUndefined(request.body.password))
        errorMsgs.push('password missing');
    if (helper.isEmpty(request.body.tags))
        errorMsgs.push('tag missing');
    if (errorMsgs.length > 0) {
        helper.log('Service Challenge: Creation not possible, data wrong');
        response.status(400).json(helper.jsonMsgError('Creation not possible, wrong data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    request.body.id = helper.IdFromToken(request.headers.cookie);
    request.body.creationdate = helper.getNow();
    request.body.description = helper.Sanitize(request.body.description);

    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    const hintDao = new HintDao(request.app.locals.dbConnection);
    const challengetagDao = new ChallengetagDao(request.app.locals.dbConnection);
    const userDao = new UserDao(request.app.locals.dbConnection);
    var b = request.body;
    var challengeid;

    try {
        if (fileHelper.hasUploadedFiles(request)) {
            var files = fileHelper.getAllUplodedFilesAsArray(request, true);

            if (files.length > 10){
                response.status(400).json(helper.jsonMsgError("Too many files! Max amount is 10."));
                return;
            }
            files.forEach(function(file) {
                if (!fileHelper.isFileOkay(file)){
                    response.status(400).json(helper.jsonMsgError("Error in uploaded files"));
                    return;
                }
            });
        }

        challenge = challengeDao.create(b.id, b.challengename, b.difficulty, b.categoryid,
                                            b.tags, b.description, b.password, b.creationdate);
        hintDao.create(challenge.challengeid, 1, request.body.hint1);
        hintDao.create(challenge.challengeid, 2, request.body.hint2);
        hintDao.create(challenge.challengeid, 3, request.body.hint3);
        for (var tagid of request.body.tags){
            challengetagDao.create(challenge.challengeid, tagid);
        }
        var user = userDao.loadById(b.id);
        userDao.update_points(user.userid, user.points + challenge.difficulty.level);

        if (fileHelper.hasUploadedFiles(request)) {
            files.forEach(function(file) {
                if (!fileHelper.isFileOkay(file)){
                    response.status(400).json(helper.jsonMsgError("Error in uploaded files"));
                    return;
                }
                challengeDao.save_file('../Frontend/data/challenge_data/' + challenge.challengeid + '/', file, challenge.challengeid);
            });
        }

        helper.log('Service Challenge: Record inserted');
        response.status(200).json(helper.jsonMsgOK(challenge));
    } catch (ex) {
        helper.logError('Service Challenge: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.put('/challenge/:id', function(request, response) {
    helper.log('Service Challenge: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.challengename)) 
        errorMsgs.push('name missing');
    if (helper.isUndefined(request.body.description)) 
        request.body.description = '';
    if (helper.isUndefined(request.body.difficulty)) 
        errorMsgs.push('difficulty missing');
    if (helper.isEmpty(request.body.tags))
        errorMsgs.push('tags missing')
    if (errorMsgs.length > 0) {
        helper.log('Service Challenge: Updating not possible, data missing: ' + errorMsgs);
        response.status(400).json(helper.jsonMsgError('Creation not possible, missing data: ' +
                                                      helper.concatArray(errorMsgs)));
        return;
    }

    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    const hintDao = new HintDao(request.app.locals.dbConnection);
    request.body.description = helper.Sanitize(request.body.description);
    try {
        hintDao.update(request.params.id, 1, request.body.hint1);
        hintDao.update(request.params.id, 2, request.body.hint2);
        hintDao.update(request.params.id, 3, request.body.hint3);
        var result = challengeDao.update(request.params.id, request.body.challengename, request.body.description,
                                         request.body.password, request.body.difficulty, request.body.categoryid,
                                         request.body.tags.split(','));
        helper.log('Service Challenge: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Challenge: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/challenge/:id', function(request, response) {
    helper.log('Service Challenge: Client requested deletion of record, id=' + request.params.id);

    const challengeDao = new ChallengeDao(request.app.locals.dbConnection);
    try {
        var obj = challengeDao.loadById(request.params.id);
        challengeDao.delete(request.params.id);
        helper.log('Service Challenge: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'deleted': true, 'entry': obj }));
    } catch (ex) {
        helper.logError('Service Challenge: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;