import React from 'react';
import Widget from './Widget/index';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


class WidgetList extends React.Component {
  scrollToBottom() {
    this.refs.rskWidgetList.scrollTop = this.refs.rskWidgetList.scrollHeight;
  }

  componentDidMount() {
    this.refs.rskWidgetList.scrollTop = this.refs.rskWidgetList.scrollHeight
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.viewer.widgetsCount > this.props.viewer.widgetsCount) {
      setTimeout(() => {
        this.refs.rskWidgetList.scrollTop = this.refs.rskWidgetList.scrollHeight
      }, 300)
    }
  }

  handleScroll(event) {
    if (!event.target.scrollTop && this.props.viewer.widgetsCount > this.props.viewer.widgets.edges.length) {
      let loadingIndicator = this.refs.loadingIndicator;
      let rskWidgetListUl = this.refs.rskWidgetListUl;
      const firstElement = rskWidgetListUl.children[0].children[0];
      loadingIndicator.className = 'loading-indicator';
      rskWidgetListUl.className = 'feather';

      this.props.loadMoreWidgets().then(() => {
        setTimeout(()=>{
          loadingIndicator.className = 'loading-indicator hidden';
          rskWidgetListUl.className = '';
          firstElement.scrollIntoView();
        }, 600);
      });
    }
  }

  render() {
    return (
      <div ref="rskWidgetList" onScroll={::this.handleScroll} className="rsk-widget-list">
        <div ref="loadingIndicator" className="loading-indicator hidden"><i className="fa fa-refresh fa-spin" /></div>
        <ul ref="rskWidgetListUl">
          <ReactCSSTransitionGroup transitionName="expand" transitionEnterTimeout={0} transitionLeaveTimeout={0}>
            {this.props.viewer.widgets.edges.map(edge => (
              <Widget
                {...this.props}
                key={edge.node.id}
                widget={edge.node}
              />
            ))}
          </ReactCSSTransitionGroup>
        </ul>
      </div>
    );
  }
}



export default WidgetList;
