import Relay from 'react-relay';

export default class AddWidgetMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{ addWidget }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddWidgetPayload {
        viewer {
          widgets
        },
        widgets
      }
    `;
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewer.id,
        },
      },
      {
        type: 'RANGE_ADD',
        parentName: 'viewer',
        parentID: this.props.viewer.id,
        connectionName: 'widgetConnection',
        edgeName: 'widgets',
        rangeBehaviors: {
          '': 'append',
          'status(any)': 'append',
          'status(active)': 'append',
          'status(completed)': null,
        },
      },
    ];
  }

  getVariables() {
    return {
      viewerId: this.props.viewer.id,
      body: this.props.body,
    };
  }

  getOptimisticResponse() {
    const { viewerId, body } = this.props;

    return {
      viewer: {
        id: viewerId,
      },
      widgets: {
        node: {
          body,
        },
      },
    };
  }
}
