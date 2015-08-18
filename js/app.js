import {Router, Route} from 'react-router';
import BrowserHistory from 'react-router/lib/BrowserHistory';

import App from './components/App';
import Widget from './components/Widget';

function createRelayContainer(Component, props) {
  if (Relay.isContainer(Component)) {
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

var HomeQueries = {
  viewer: (Component) => Relay.QL`
    query {
      viewer {
        ${Component.getFragment('viewer')},
      },
    }
  `,
};

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
  <Router history={new BrowserHistory()} createElement={createRelayContainer}>
    <Route>
      <Route
        name="home"
        path="/"
        component={App}
        queries={HomeQueries}
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
