import {Router, Route} from 'react-router';
import BrowserHistory from 'react-router/lib/BrowserHistory';

import relayNestedRoutes from 'relay-nested-routes';

import App from './components/App';
import Widget from './components/Widget';

const NestedRootContainer = relayNestedRoutes(React, Relay);

// The root queries for the main site
var HomeQueries = {
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
  <Router history={new BrowserHistory()}>
    <Route component={NestedRootContainer}>
      <Route
        name="home" // added a name to the route
        path="/"
        component={App}
        queries={HomeQueries} // and the query
      />
      <Route
        name="widget"
        path="/widget/:id"
        component={Widget}
        queries={WidgetQueries}
      />
    </Route>
  </Router>,
  document.getElementById('root')
);
