const path = require('path');
const { createHandler } = require("graphql-http/lib/use/express");

const rootDirectoryStr = path.dirname(require.main.filename);

const schema = require(path.join(rootDirectoryStr, 'graphQL', 'schema.js'));
const root = require(path.join(rootDirectoryStr, 'graphQL', 'resolvers.js'));

module.exports = createHandler({
    schema: schema,
    rootValue: root
});