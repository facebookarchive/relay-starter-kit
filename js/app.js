import React from 'react';
import Relay from 'react-relay';

import {Router, Route} from 'react-router';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import ReactRouterRelay from 'react-router-relay';

import App from './components/App';
import Widget from './components/Widget';

// The root queries for the main site
var AppQueries = {
  viewer: (Component) => Relay.QL`
    query {
      viewer {
        ${Component.getFragment('viewer')},
      },
    }
  `,
};

// The root queries for the widget site
var WidgetQueries = {
  widget: (Component) => Relay.QL`
    query {
      node(id: $id) {
        ${Component.getFragment('widget')},
      },
    }
  `,
};

React.render(
  <Router
    history={new BrowserHistory()}
    createElement={ReactRouterRelay.createElement}>
    <Route
      path="/"
      component={App}
      queries={AppQueries} // and the query
    />
    <Route
      path="/widget/:id"
      component={Widget}
      queries={WidgetQueries}
    />
  </Router>,
  document.getElementById('root')
);
