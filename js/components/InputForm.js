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
              <textarea
                defaultValue={edge.node.body}
                placeholder="Type a message..."
                key={edge.node.id}
                onKeyDown={handleUpdate.bind(this, edge.node)}
              />
            ))
          :
          <textarea placeholder="Type a message..." onKeyDown={handleAdd} />
      }
    </div>
  );
};


export default InputForm;
