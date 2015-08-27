import 'babel/polyfill';

import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

class Widget extends React.Component {
  render() {
    var {widget} = this.props;
    return (
      <div>
        <h1>Widget {widget.name}</h1>
        <div>
          {widget.id}
        </div>
        <div>
          <Link to="/">Back</Link>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Widget, {
  fragments: {
    widget: () => Relay.QL`
      fragment on Widget {
        id,
        name,
      }
    `,
  },
});
