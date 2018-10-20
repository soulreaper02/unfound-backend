
const mongoose = require('mongoose');
const chalk = require('chalk');

const uri = 'mongodb://cerebro:1q2w3e4r5t@ds159493.mlab.com:59493/hackathon'
module.exports = {
    connectionString: uri
}

// logging mongoDb connection
mongoose.connection.on('connected', function() {
    console.log(chalk.green('MongoDB connected @ mongodb://<dbuser>:<dbpassword>@ds159493.mlab.com:59493/hackathon'));
});

mongoose.connection.on('error', function(err) {
    console.log(chalk.red('MongoDB error: ' + err));
});