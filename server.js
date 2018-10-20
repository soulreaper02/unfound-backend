'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const chalk = require('chalk');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');

const app = express();
const dbConfig = require('./configuration/database');

/**
 * Port and Database configuration
 */
app.set('port', (process.env.PORT || 9000));
mongoose.connect(dbConfig.connectionString, { useNewUrlParser: true });

/**
 * Setting up the Express APP
 */

app.use(morgan('dev')); //logs every request to the console.
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.set('trust proxy', 1);
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(fileUpload());

mongoose.connection.on('connected', function(){
    app.listen(app.get('port'), function() {
        const url = 'http://localhost:' + app.set('port');
        console.log('Application running on port: ', chalk.green(app.get('port')));
        console.log('click to open in a browser: ' + url );  
    });
});

/**
 * Set up routes
 */

require('./routes/process')(app,mongoose,chalk); //file processing route.