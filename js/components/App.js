import React from 'react';
import Relay from 'react-relay';
import AddWidgetMutation from '../mutations/AddWidgetMutation';
import UpdateWidgetMutation from '../mutations/UpdateWidgetMutation';
import AppState from './AppState';
import WidgetList from './WidgetList';
import InputForm from './InputForm';
import WidgetCounter from './WidgetCounter';

class App extends React.Component {
  widgetAdd(event) {
    const { relay, viewer } = this.props;
    relay.commitUpdate(new AddWidgetMutation({ viewer, viewerId:viewer.id, body: event.target.value }));
    event.target.value = null;
  };
  
  widgetUpdate(widget, event) {
    const { relay } = this.props;
    relay.commitUpdate(new UpdateWidgetMutation({ widget, body: event.target.value }));
    this.props.updateState({ activeWidgetId: null });
  };

  render() {
    return (
      <div className="rsk-app">
        <WidgetCounter {...this.props} />
        <WidgetList {...this.props} />
        <InputForm {...this.props} handleAdd={::this.widgetAdd}  handleUpdate={::this.widgetUpdate} />
      </div>
    );
  }
}

export default Relay.createContainer(AppState(App), {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        widgetsCount,
        widgets(last: 50) {
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
