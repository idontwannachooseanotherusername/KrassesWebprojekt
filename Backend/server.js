/////////////////
// workaround / bugfix for linux systems
Object.fromEntries = l => l.reduce((a, [k,v]) => ({...a, [k]: v}), {})
/////////////////

const helper = require('./helper.js');
const fileHelper = require('./fileHelper.js');
helper.log('Starting server...');

try {
    // connect database
    helper.log('Connect database...');
    const Database = require('better-sqlite3');
    const dbOptions = { verbose: console.log };
    const dbFile = './db/db.sqlite';
    const dbConnection = new Database(dbFile, dbOptions);

    // create server
    const HTTP_PORT = 8001;
    const express = require('express');
    const fileUpload = require('express-fileupload');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const morgan = require('morgan');
    const _ = require('lodash');
    const path = require("path"); 

    helper.log('Creating and configuring Web Server...');
    const app = express();
    
    // provide service router with database connection / store the database connection in global server environment
    app.locals.dbConnection = dbConnection;

    helper.log('Binding middleware...');
    app.use(fileUpload({
        createParentPath: true,
        limits: {
            fileSize: 2 * 1024 * 1024 * 1024        // limit to 2MB
        }
    }));
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(bodyParser.json());
    var root = '../Frontend';
    app.use(express.static(path.resolve(root)));
    console.log('PATH:' + path.resolve(root + '/images'));
    app.use(function(request, response, next) {
        response.setHeader('Access-Control-Allow-Origin', '*'); 
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.use(morgan('dev'));

    // binding endpoints
    const TOPLEVELPATH = '/wba2api';
    helper.log('Binding enpoints, top level Path at ' + TOPLEVELPATH);
    
    var serviceRouter = require('./services/user.js');
    app.use(TOPLEVELPATH, serviceRouter);

    var serviceRouter = require('./services/user.js');
    app.use(TOPLEVELPATH, serviceRouter);

    var serviceRouter = require('./services/country.js');
    app.use(TOPLEVELPATH, serviceRouter);

    var serviceRouter = require('./services/hint.js');
    app.use(TOPLEVELPATH, serviceRouter);

    var serviceRouter = require('./services/category.js');
    app.use(TOPLEVELPATH, serviceRouter);

    var serviceRouter = require('./services/difficulty.js');
    app.use(TOPLEVELPATH, serviceRouter);

    //var serviceRouter = require('./services/challengefile.js');
    //app.use(TOPLEVELPATH, serviceRouter);

    //var serviceRouter = require('./services/challengetag.js');
    //app.use(TOPLEVELPATH, serviceRouter);

    //var serviceRouter = require('./services/challengecategory.js');
    //app.use(TOPLEVELPATH, serviceRouter);

    //var serviceRouter = require('./services/solved.js');
    //app.use(TOPLEVELPATH, serviceRouter);

    var serviceRouter = require('./services/challenge.js');
    app.use(TOPLEVELPATH, serviceRouter);

    //var serviceRouter = require('./services/tag.js');
    //app.use(TOPLEVELPATH, serviceRouter);
    
    //serviceRouter = require('./services/dateiuploadeinzeln.js');
    //app.use(TOPLEVELPATH, serviceRouter);

    //serviceRouter = require('./services/dateiuploadmehrere.js');
    //app.use(TOPLEVELPATH, serviceRouter);

    // send default error message if no matching endpoint found
    app.use(function (request, response) {
        response.status(404)
        response.sendFile('/errorsite.html', {'root': root});
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
