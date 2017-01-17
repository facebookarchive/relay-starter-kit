/**
 * Created by klik on 1/3/17.
 */
import React from 'react'

class SearchForm extends React.Component {
  static propTypes = {
    searchAction: React.PropTypes.func.isRequired
  }

  handleChange = event => {
    this.props.searchAction(event.target.value)
  }

  render () {
    return (
      <form className="navbar-form" role="search">
        <input type="text" className="form-control"
               placeholder="Search..."
               onChange={this.handleChange} />
      </form>
    )
  }
}

export default SearchForm