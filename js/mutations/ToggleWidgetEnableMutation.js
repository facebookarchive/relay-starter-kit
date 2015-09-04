// Mutation for toggling widget enabled on/off

export default class ToggleWidgetEnableMutation extends Relay.Mutation {
  static fragments = {
    post: () => Relay.QL`
      fragment on Widget {
        id,
        enabled
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{ToggleWidgetEnable}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on ToggleWidgetEnablePayload {
        widget {
          enabled
        },
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        post: this.props.widget.id,
      },
    }];
  }

  getVariables() {
    return {
      id: this.props.widget.id,
    };
  }

  getOptimisticResponse() {
    return {
      post: {
        id: this.props.widget.id,
        kudosCount: !this.props.widget.enabled
      }
    };
  }
}
