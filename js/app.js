import {Router, Route} from 'react-router';
import BrowserHistory from 'react-router/lib/BrowserHistory';

import App from './components/App';
import Widget from './components/Widget';

// A wrapper to create a Relay container
function createRelayContainer(Component, props) {
  if (Relay.isContainer(Component)) {
    // Construct the RelayQueryConfig from the route and the router props.
    var {name, queries} = props.route;
    var {params} = props;
    return (
      <Relay.RootContainer
        Component={Component}
        route={{name, params, queries}}
      />
    );
  } else {
    return <Component {...props}/>;
  }
}

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
  <Router
    history={new BrowserHistory()}
    createElement={createRelayContainer}>
    <Route>
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
