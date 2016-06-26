import React from 'react';
import Relay from 'react-relay';
import AddWidgetMutation from '../mutations/AddWidgetMutation';
class App extends React.Component {
  onNewWidgetSave(event) {
    const { relay, viewer } = this.props;
    relay.commitUpdate(
      new AddWidgetMutation({ viewer, name: event.target.value })
    );
  };

  render() {
    return (
      <div>
        <h1>Widget list</h1>
        <ul>
          {this.props.viewer.widgets.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.name} (ID: {edge.node.id})</li>
          )}
        </ul>

        <input type="text" onChange={::this.onNewWidgetSave}/>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        widgets(last: 10) {
          edges {
            node {
              id,
              name,
            },
          },
        },
         ${AddWidgetMutation.getFragment('viewer')}
      }
    `,
  },
});
