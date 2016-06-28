import Relay from 'react-relay';

export default class RemoveWidgetMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{ removeWidget }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RemoveWidgetPayload {
        viewer
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'widgetConnection',
      deletedIDFieldName: 'deletedId',
    }];
  }

  getVariables() {
    return {
      id: this.props.widget.id,
    };
  }

  getOptimisticResponse() {
    const { viewer, widget } = this.props;
    const viewerPayload = { id: viewer.id };

    return {
      viewer: viewerPayload,
      deletedId: widget.id,
      widgetsCount: this.props.viewer.widgetsCount + 1,
    };
  }
}