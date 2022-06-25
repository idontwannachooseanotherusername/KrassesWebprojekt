const helper = require('../helper.js');
const fileHelper = require('../fileHelper.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service DateiUploadMehrere');

serviceRouter.post('/dateiuploadmehrere', async(request, response) => {
    helper.log('Service DateiUploadMehrere called');

    try {
        // if no files received, send error
        if (!fileHelper.hasUploadedFiles(request)) {
            console.log('no files transmitted, nothing to do');
            response.status(400).json(helper.jsonMsgError('no files uploaded'));
        } else {

            helper.log('count of uploaded files ' + fileHelper.cntUploadedFiles(request));

            // get all file objects
            var files = fileHelper.getAllUplodedFilesAsArray(request, true);
            //helper.log(files);

            /////////////////////////////////////////////////////////
            // do anything what you want with this data
            /////////////////////////////////////////////////////////

            helper.log('creating response');
            var res = [];
            
            files.forEach(function(item) {
                res.push({
                    status: true,
                    fileSaved: false,
                    fileName: item.name,
                    fileSize: item.size,
                    fileMimeType: item.mimetype,
                    fileEncoding: item.encoding,
                    fileHandle: item.handleName,
                    fileNameOnly: item.nameOnly,
                    fileExtension: item.extension,
                    fileIsPicture: item.isPicture
                });
            });

            // send response
            response.status(200).json(res);            
        }

    } catch (err) {
        response.status(500).json(helper.jsonMsgError('error in service'));
    }
    
});

module.exports = serviceRouter;