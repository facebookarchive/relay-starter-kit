import React from 'react';
import Widget from './Widget';

const WidgetList = (props) => (
  <div className="rsk-widget-list">
    <ul>
      {props.viewer.widgets.edges.map(edge => (
        <Widget
          {...props}
          key={edge.node.id}
          widget={edge.node}
        />
      ))}
    </ul>
  </div>
);


export default WidgetList;
