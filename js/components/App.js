import React from 'react';
import Relay from 'react-relay';
import { debounce } from 'lodash';
import SearchForm from '../search-form';
import Quote from '../quote';

class App extends React.Component {
    constructor(props) {
    super(props)
    this.search = debounce(this.search.bind(this), 300)
  }
  search(searchTerm) {
    this.props.relay.setVariables({ searchTerm });
  }

  render() {
    return (
      <div className="quotes-library">
        <SearchForm searchAction={this.search} />
        <div className="quotes-list">
          {this.props.viewer.quotes.edges.map(edge =>
            <Quote key={edge.node.id} quote={edge.node} />
          )}
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    searchTerm: '',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
            quotes(first:100, searchTerm: $searchTerm) {
                edges {
                    node {
                        id
                        ${Quote.getFragment('quote')}
                    }
                }
            }
        }
    `,
  },
});
