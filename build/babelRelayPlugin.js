var getbabelRelayPlugin = require('babel-relay-plugin');
var schema = require('../data/schema.json');

module.exports = schema.data ? getbabelRelayPlugin(schema.data) : {};