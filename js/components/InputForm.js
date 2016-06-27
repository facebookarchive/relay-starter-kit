import React from 'react';

const InputForm = (props) => {

  const isEnterKeyUsed = (event) => {
    const enterKey = 13;
    if (event.keyCode === enterKey ) {
      event.preventDefault();
      if (!event.target.value) {
        props.updateState({activeWidgetId: 0});
        return;
      }
      return true;
    }
  };

  const handleAdd = (event) => isEnterKeyUsed(event) ? props.handleAdd(event) : null;
  const handleUpdate = (widget, event) => { isEnterKeyUsed(event) ? props.handleUpdate(widget, event) : null };

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
