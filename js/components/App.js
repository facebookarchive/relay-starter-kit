import React from 'react';
import Relay from 'react-relay';
import Widget from './Widget';
import AddWidgetMutation from '../mutations/AddWidgetMutation';
import UpdateWidgetMutation from '../mutations/UpdateWidgetMutation';

class App extends React.Component {
  onNewWidgetSave(event) {
    const { relay, viewer } = this.props;
    relay.commitUpdate(
      new AddWidgetMutation({ viewer, name: event.target.value })
    );
  };
  onWidgetUpdate(widget) {
    const { relay, viewer } = this.props;
    widget.name = 'bam';
    relay.commitUpdate(
      new UpdateWidgetMutation({ name: widget.name , viewer, widget })
    );
  };

  render() {
    return (
      <div>
        <h1>Widget list</h1>
        <ul>
          {this.props.viewer.widgets.edges.map(edge => (
            <Widget
              key={edge.node.id}
              onClick={this.onWidgetUpdate.bind(this, edge.node)}
              widget={edge.node}
            />
          ))}
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
              ${UpdateWidgetMutation.getFragment('widget')},

            },
          },
        },
        ${AddWidgetMutation.getFragment('viewer')},
      }
    `,
  },
});
