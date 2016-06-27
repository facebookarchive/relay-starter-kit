import React from 'react';

let state = { activeWidgetId: 0 };

const appState = (Child) => {
  return class extends React.Component {
    mandatory() {
      throw new Error('Missing newState for updateState');
    }

    updateState(newState = this.mandatory()) {
      Object.assign(state, newState);
      this.setState(state)
    }

    render() {
      return <Child updateState={::this.updateState} state={state} {...this.props} />;
    }
  };
};


export default appState;
