var fs = require('fs');
var getBabelGraphQLPlugin = require('babel-relay-plugin');
var path = require('path');

var SCHEMA_PATH = path.resolve(__dirname, '../data/schema.json');

var schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));

module.exports = getBabelGraphQLPlugin(schema.data);
