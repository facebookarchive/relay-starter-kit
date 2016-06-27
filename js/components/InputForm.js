import React from 'react';

const InputForm = (props) => {
  const enterKey = 13;
  const handleAdd = (event) => event.keyCode === enterKey ? props.handleAdd(event) : null;
  const handleUpdate = (widget, event) => { event.keyCode === enterKey ? props.handleUpdate(widget, event) : null };

  return (
    <div className="rsk-widget-form">
      {
        !!props.state.activeWidgetId
          ?
          props.viewer.widgets.edges
            .filter(edge => edge.node.id === props.state.activeWidgetId )
            .map(edge => (
              <input
                defaultValue={edge.node.body}
                key={edge.node.id}
                onKeyDown={handleUpdate.bind(this, edge.node)}
                type="text"
                id="widget"
              />
            ))
          :
          <input onKeyDown={handleAdd} type="text" id="widget"/>
      }
    </div>
  );
};


export default InputForm;
