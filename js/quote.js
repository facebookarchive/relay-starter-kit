/* eslint-disable no-class-assign */
import React from 'react'
import Relay from 'react-relay'
// create a mutation class and import it here where are using on the click handler thumbsUpClick

import ThumbsUpMutation from './thumbs-up-mutation.js'
/* Implement quoteLikes in UI using graphql directives to show only when someone clicks on a quote element. We need to add a function to Quote class that will do something based on passed in gql directive */

class Quote extends React.Component {
/*  add showLikes function for what to do when onClick event is triggered. add click handler to icon to trigger increment.
thumbsUpClick will simply instantiate a mutation class and pass it to
Relay.Store.commitUpdate:*/
  thumbsUpClick = () => {
    Relay.Store.commitUpdate(
      new ThumbsUpMutation({
        quote: this.props.quote,
      })
    )
  }

  showLikes = () => {
    this.props.relay.setVariables({ showLikes:true })
  }
  displayLikes () {
    if (!this.props.relay.variables.showLikes) {
      return null
    }
    return <div>
      {this.props.quote.likesCount} &nbsp;
      <span className="glyphicon glyphicon-thumbs-up" onClick={this.thumbsUpClick}></span>
    </div>
  }

// Adding onClick event handler on every quote by passing it as a param on the main div - blockquote.
  render () {
    return (
      <blockquote onClick={this.showLikes}>
        <p>{this.props.quote.text}</p>
        <footer>{this.props.quote.author}</footer>
        {this.displayLikes()}
      </blockquote>
    )
  }
}

// add new showLikes variable to relay container body
// add fragment def from ThumbsUpMutation so Relay can know what it needs to give that class and get it.

Quote = Relay.createContainer(Quote, {
  initialVariables: {
    showLikes: false,
  },
  fragments: {
    quote: () => Relay.QL `
        fragment OneQuote on Quote {
            ${ThumbsUpMutation.getFragment('quote')}
            text
            author
            likesCount @include(if: $showLikes)
        }
    `,
  },
})

export default Quote
