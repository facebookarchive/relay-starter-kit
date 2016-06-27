import React from 'react';
import Relay from 'react-relay';
import AddWidgetMutation from '../mutations/AddWidgetMutation';
import UpdateWidgetMutation from '../mutations/UpdateWidgetMutation';
import AppState from './AppState';
import WidgetList from './WidgetList';
import InputForm from './InputForm';

class App extends React.Component {
  widgetAdd(event) {
    const { relay, viewer } = this.props;
    relay.commitUpdate(new AddWidgetMutation({ viewer, viewerId:viewer.id, body: event.target.value }));
    event.target.value = '';
  };
  
  widgetUpdate(widget, event) {
    const { relay } = this.props;
    relay.commitUpdate(new UpdateWidgetMutation({ widget, body: event.target.value }));
    this.props.updateState({ activeWidgetId: null });
    event.target.value = '';
  };

  render() {
    return (
      <div className="rsk-app">
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
