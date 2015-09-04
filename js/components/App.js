import 'babel/polyfill';

// Mutations
import ToggleWidgetEnableMutation from '../mutations/ToggleWidgetEnableMutation';

class App extends React.Component {
  _handleToggleEnabled = (i) => {
    Relay.Store.update(new ToggleWidgetEnableMutation({
      widget: this.props.viewer.widgets.edges[i].node,
    }));
  }
  
  render() {
    return (
      <div>
        <h1>Widget list</h1>
        <ul>
          {this.props.viewer.widgets.edges.map((edge, i) =>
            <li>
              {edge.node.name} (ID: {edge.node.id}) Enabled: {edge.node.enabled ? <span>TRUE</span> : <span>FALSE</span>}
              <button onClick={this._handleToggleEnabled.bind(null, i)} id={'button' + i}>
                Toggle on/off
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        widgets(first: 10) {
          edges {
            node {
              id,
              name,
              enabled,
              ${ToggleWidgetEnableMutation.getFragment('widget')},
            },
          },
        },
      }
    `,
  },
});
