
import Relay from 'react-relay';

export default class UpdateWidgetMutation extends Relay.Mutation {
  static fragments = {
    widget: () => Relay.QL`
      fragment on Widget {
        id,
        name
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{ updateWidget }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateWidgetPayload {
        widget
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
      name: this.props.name,
    };
  }

  getOptimisticResponse() {
    return {
      widget: {
        id: this.props.widget.id,
        name: this.props.name,
      },
    };
  }
}
