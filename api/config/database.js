const mongoose = require('mongoose');
const variables = require("./variables");

//building connection link
function getConnectionLink()
{
    let link = "mongodb://";
    if(variables.database.user)
        link += variables.database.user + ":" + variables.database.password + "@";
    
    link += variables.database.host + ":" + variables.database.port + "/" + variables.database.database;
    return link;
}

module.exports.load = function()
{
	mongoose.connect(getConnectionLink(), { useMongoClient: true });
	mongoose.Promise = global.Promise;
	mongoose.set('debug', true);
};