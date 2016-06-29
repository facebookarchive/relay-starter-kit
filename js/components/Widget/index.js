import React from 'react';
import TimeStamp from './TimeStamp';
const WidgetAvatar = (props) => (
  <div className="widget-avatar">
    <img title={props.viewer.name} src="https://unsplash.it/28" alt="avatar" />
  </div>
);
const WidgetBody = (props) => <div className="widget-body">{props.widget.body}{props.cursor}</div>;
const WidgetEditBtn = (props) => <i onClick={props.handleEditBtnClick} className="btn btn-edit fa fa-pencil" />;
const WidgetDeleteBtn = (props) => <i onClick={props.handleDeleteBtnClick} className="btn btn-edit fa fa-trash-o" />;

const Widget = (props) => {
  const handleEditBtnClick = () => props.updateState({ activeWidgetId : props.widget.id });
  const handleDeleteBtnClick = () => props.handleRemove(props.widget);

  return (
    <li>
      <div className="rsk-widget">
        <WidgetAvatar {...props} />
        <WidgetBody {...props} />
        <WidgetEditBtn handleEditBtnClick={handleEditBtnClick} {...props} />
        <WidgetDeleteBtn handleDeleteBtnClick={handleDeleteBtnClick}  {...props} />
      </div>
      <TimeStamp {...props} />
    </li>
  );
};


export default Widget;
