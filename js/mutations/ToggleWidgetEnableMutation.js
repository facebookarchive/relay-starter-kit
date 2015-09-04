// Mutation for toggling widget enabled on/off

export default class ToggleWidgetEnableMutation extends Relay.Mutation {
  static fragments = {
    widget: () => Relay.QL`
      fragment on Widget {
        id,
        enabled,
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{toggleWidgetEnable}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on ToggleWidgetEnablePayload {
        widget {
          enabled,
        },
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        widget: this.props.widget.id,
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
      widget: {
        id: this.props.widget.id,
        enabled: !this.props.widget.enabled,
      }
    };
  }
}
