import React from 'react';
import Relay from 'react-relay';
import AddWidgetMutation from '../mutations/AddWidgetMutation';
import UpdateWidgetMutation from '../mutations/UpdateWidgetMutation';

class App extends React.Component {
  widgetSave(event) {
    const { relay, viewer } = this.props;
    relay.commitUpdate(new AddWidgetMutation({ viewer, viewerId:viewer.id, body: event.target.value }));
  };
  widgetUpdate(widget) {
    const { relay, viewer } = this.props;
    const body = 'pow';
    relay.commitUpdate(new UpdateWidgetMutation({ widget, body }));
  };

  render() {
    const enterKey = 13;
    const handleKeyDown = (event) => event.keyCode === enterKey ? this.widgetSave(event) : null;
    const InputForm = (props) => (
      <div className="rsk-widget-form">
        <div className="form-group">
          <label htmlFor="widget">New entry</label>
          <input onKeyDown={handleKeyDown} type="text" id="widget"/>
        </div>
      </div>
    );

    const WidgetBody = (props) => <div className="widget-body">{props.widget.body}</div>;
    const WidgetEditBtn = (props) => <div onClick={props.onClick} className="btn-edit">edit</div>;
    const WidgetDeleteBtn = (props) => <div className="btn-delete">delete</div>;
    const WidgetTimeOriginal = (props) => <div className="timestamp-original">{props.widget.dateCreated}</div>;
    const WidgetTimeEdited = (props) => <div className="timestamp-edited">{props.widget.dateEdited}</div>;
    const WidgetTime = (props) => props.widget.dateEdited ? <WidgetTimeEdited {...props} /> : <WidgetTimeOriginal {...props} />;

    const Widget = (props) => (
      <li>
        <div className="widget-row">
          <WidgetBody {...props} />
          <WidgetEditBtn  {...props} />
          <WidgetDeleteBtn  {...props} />
        </div>

        <WidgetTime {...props} />
      </li>
    );
    const WidgetList = (props) => (
      <div className="rsk-widget-list">
        <ul>
          {this.props.viewer.widgets.edges.map(edge => (
            <Widget
              key={edge.node.id}
              onClick={this.widgetUpdate.bind(this, edge.node)}
              widget={edge.node}
            />
          ))}
        </ul>
      </div>
    );


    return (
      <div className="rsk-app">
        <WidgetList {...this.props} />
        <InputForm />
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        widgets(last: 10) {
          edges {
            node {
              id,
              body,
              ${UpdateWidgetMutation.getFragment('widget')},
              dateCreated,
              dateEdited
            },
          },
        },
        ${AddWidgetMutation.getFragment('viewer')},
      }
    `,
  },
});
