const path = require('path');

const expressSession = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(expressSession);

const rootDirectoryStr = path.dirname(require.main.filename);
const connectionStr = require(path.join(rootDirectoryStr, 'sensitive', 'mongooseDBConnectionStr.js'));
const sessionSecretStr = require(path.join(rootDirectoryStr, 'sensitive', 'expressSessionSecretStr.js'));

const store = MongoDBStore({
    uri: connectionStr,
    collection: 'sessions'
});

const sessionArgsObj = {
    secret: sessionSecretStr,
    resave: false,
    saveUninitialized: false,
    store: store
};

module.exports = expressSession(sessionArgsObj);