var getBabelGraphQLPlugin = require('babel-relay-plugin');
var schema = require('../data/schema.json');

module.exports = getBabelGraphQLPlugin(schema.data);