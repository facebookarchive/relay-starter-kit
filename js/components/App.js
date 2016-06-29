import React from 'react';
import Relay from 'react-relay';
import AddWidgetMutation from '../mutations/AddWidgetMutation';
import UpdateWidgetMutation from '../mutations/UpdateWidgetMutation';
import RemoveWidgetMutation from '../mutations/RemoveWidgetMutation';
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
  
  widgetRemove(widget) {
    const { relay, viewer } = this.props;
    relay.commitUpdate(new RemoveWidgetMutation({ viewer, widget }));
    this.props.updateState({ activeWidgetId: null });
  };

  loadMoreWidgets() {
    const { relay } = this.props;
    return new Promise(
      resolve => relay.setVariables({ limitLast: this.props.relay.variables.limitLast + 10 }, () => resolve())
    );
  }

  render() {
    return (
      <div className="rsk-app">
        <WidgetCounter {...this.props} />
        <WidgetList loadMoreWidgets={::this.loadMoreWidgets} {...this.props} handleRemove={::this.widgetRemove} />
        <InputForm
          {...this.props}
          handleAdd={::this.widgetAdd}
          handleUpdate={::this.widgetUpdate}
        />
      </div>
    );
  }
}

export default Relay.createContainer(AppState(App), {
  initialVariables: {
    limitLast: 20,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        widgetsCount,
        name,
        ${AddWidgetMutation.getFragment('viewer')},
        ${RemoveWidgetMutation.getFragment('viewer')},
        widgets(last: $limitLast) {
          edges {
            node {
              ${UpdateWidgetMutation.getFragment('widget')},
              id,
              body,
              dateCreated,
              dateEdited
            },
          },
        },
      }
    `,
  },
});
