import React from 'react';
import Relay from 'react-relay';

import UpdateFriendsMutation from '../updateFriendsMutation';

class App extends React.Component {
  constructor() {
    super();
    this.friendInput = null;
    this.state = {
        friends: []
      }
  }

  addFriend() {
    const newFriends = this.state.friends.concat(this.friendInput.value);
    this.setState({friends: newFriends})
    this.friendInput = null;
  }

  sendFriends() {
    const friends = this.state.friends;
    this.setState({friends: []});
    this.props.relay.commitUpdate(new UpdateFriendsMutation({
        id: this.props.viewer.people.edges[0].node.id,
        friends: friends
      }));
   }

  render() {
    return (
      <div>
        <h1>Widget list</h1>
        <ul>
          {this.props.viewer.widgets.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.name} (ID: {edge.node.id})</li>
          )}
        </ul>
        <input ref={(input) => {this.friendInput = input;}} />
        <button onClick={() => this.addFriend()}> Mark as Friend</button>
        <p> Friends To be added: </p>
        <ul>
          {this.state.friends.length === 0 ?
            (<p> Add some friends! </p>) :
            this.state.friends.map((friend, id) => <li key={id}> {friend} </li>) }
        </ul>
        <button onClick={() => this.sendFriends()}> Send Friends </button>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        people(first: 1) {
          edges {
            node {
              id
            }
          }
        }
        widgets(first: 10) {
          edges {
            node {
              id,
              name
            },
          },
        },
      }
    `,
  },
});
