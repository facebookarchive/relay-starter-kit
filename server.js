import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {Schema} from './data/schema';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
var graphQLServer = express();

// Allow graphql endpoint to be loaded cross-origin so it works with
// the GraphiQL example.
// Lightly changed from http://stackoverflow.com/a/13148080.
graphQLServer.use(function(req, res, next) {
  var oneof = false;
  if(req.headers.origin &&
     req.headers.origin.match(/^https?:[/][/]localhost/)) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    oneof = true;
  }
  if(req.headers['access-control-request-method']) {
    res.header(
      'Access-Control-Allow-Methods',
      req.headers['access-control-request-method']
    );
    oneof = true;
  }
  if(req.headers['access-control-request-headers']) {
    res.header(
      'Access-Control-Allow-Headers',
      req.headers['access-control-request-headers']
    );
    oneof = true;
  }
  if(oneof) {
    res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
  }

  // Intercept OPTIONS method.
  if (oneof && req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
graphQLServer.use('/', graphQLHTTP({schema: Schema, pretty: true}));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

// Serve the Relay app
var compiler = webpack({
  entry: path.resolve(__dirname, 'js', 'app.js'),
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {stage: 0, plugins: ['./build/babelRelayPlugin']}
      }
    ]
  },
  output: {filename: 'app.js', path: '/'}
});
var app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
  publicPath: '/js/',
  stats: {colors: true}
});
// Serve static resources
app.use('/', express.static('public'));
app.use('/node_modules/react', express.static('node_modules/react'));
app.use('/node_modules/react-relay', express.static('node_modules/react-relay'));
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
