import moment from 'moment';

import React, { Component } from 'react';

class TimeStamp extends Component {
  componentWillMount() {
    this.createdAgo = moment(this.props.widget.dateCreated).fromNow();
    this.editedAgo = moment(this.props.widget.dateEdited).fromNow();

    this.intervalId = setInterval(() => {
      this.createdAgo = moment(this.props.widget.dateCreated).fromNow();
      this.editedAgo = moment(this.props.widget.dateEdited).fromNow();
      this.forceUpdate();
    }, 1000 * 60);
  }

  componentWillUnMount() {
    clearInterval(this.intervalId);
  }

  render() {


    const componentTitle = this.props.widget.dateEdited ? 'edited' : 'created';
    const iconName = this.props.widget.dateEdited ? 'fa-pencil' : 'fa-paper-plane';
    const dateToShow = this.props.widget.dateEdited ? moment(this.props.widget.dateEdited).fromNow() : this.createdAgo;
    return (
      <div  className="timestamp">
        <span title={componentTitle}>
        <i className={`fa ${iconName}`} />
          {dateToShow}
        </span>
      </div>
    );
  }


}


export default TimeStamp;
