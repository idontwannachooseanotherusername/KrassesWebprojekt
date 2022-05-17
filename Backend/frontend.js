/////////////////
// workaround / bugfix for linux systems
Object.fromEntries = l => l.reduce((a, [k,v]) => ({...a, [k]: v}), {})
/////////////////

const helper = require('./helper.js');
const fileHelper = require('./fileHelper.js');
helper.log('Starting server...');

try {

    // create server
    const HTTP_PORT = 8002;
    const express = require('express');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const morgan = require('morgan');
    const _ = require('lodash');
    const path = require("path"); 

    helper.log('Creating and configuring Web Server...');
    const app = express();

    helper.log('Binding middleware...');
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(bodyParser.json());
    app.use(express.static(path.resolve('../Frontend')));
    app.use(function(request, response, next) {
        response.setHeader('Access-Control-Allow-Origin', '*'); 
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.use(morgan('dev'));

    // binding endpoints
    const TOPLEVELPATH = '../Frontend';
    helper.log('Binding enpoints, top level Path at ' + TOPLEVELPATH);

    // send default error message if no matching endpoint found
    // TODO differentiate between api calls and calls to html sites
    app.use(function (request, response) {
        console.log(request.body);
        response.status(404)
        response.sendFile('errorsite.html', {'root': path.resolve(TOPLEVELPATH)});
        helper.log('Error occured, 404, resource not found');
        //response.status(404).json(helper.jsonMsgError('Resource not found'));
    });


    // starting the Web Server
    helper.log('\nBinding Port and starting Webserver...');
    app.listen(HTTP_PORT, () => {
        helper.log('Listening at localhost, port ' + HTTP_PORT);
        helper.log('\n\n-----------------------------------------');
        helper.log('exit / stop Server by pressing 2 x CTRL-C');
        helper.log('-----------------------------------------\n\n');
    });

} catch (ex) {
    helper.logError(ex);
}
