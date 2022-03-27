const helper = require('../helper.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service DateiUploadEinzeln');

serviceRouter.post('/dateiuploadeinzeln', async(request, response) => {
    helper.log('Service DateiUploadEinzeln called');

    try {

        // if no files received, send error
        if (!request.files) {
            console.log('no file transmitted, nothing to do');
            response.status(400).json(helper.jsonMsgError('no file found'));
        } else {

            // get handle on file info, in this example is 'picture' the HTML Field Name
            var picture = request.files.picture;
            helper.log(picture);

            // if we want to save the file physically in a directory (/uploads) on the server, we can use the 'mv' (move) function
            // if target directory is not existent, it is created automatically
            // keep in mind that the files have to use unique file names, otherwise they are overwritten!
            helper.log('saving file to target directory on server');
            //picture.mv('./uploads/' + picture.name);

            
            /////////////////////////////////////////////////////////
            // do anything what you want with this data
            /////////////////////////////////////////////////////////


            helper.log('creating response');
            var res = {
                status: true,
                fileSaved: false,
                fileName: picture.name,
                fileSize: picture.size,
                fileMimeType: picture.mimetype,
                fileEncoding: picture.encoding
            };

            // send response
            response.status(200).json(res);
        }
        

    } catch (err) {
        response.status(500).json(helper.jsonMsgError('error in service'));
    }
    
});

module.exports = serviceRouter;