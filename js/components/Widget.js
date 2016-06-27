import React from 'react';
import Relay from 'react-relay';
import UpdateWidgetMutation from '../mutations/UpdateWidgetMutation';
import AddWidgetMutation from '../mutations/AddWidgetMutation';

class Widget extends React.Component {
  render() {
    return (
      <div>
        <h1 onClick={this.props.onClick}>{this.props.widget.name}</h1>
      </div>
    );
  }
}

export default Widget;
