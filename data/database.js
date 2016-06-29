/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */
import moment from 'moment';

// Model types
class User {}
class Widget {}
const getNewWidgetId = (() => {
    let id = 1;
    return () => id += 1;
})();
// Mock data
var viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';
var widgets = ['What\'s-it', 'Who\'s-it', 'How\'s-it'].map((name, i) => {
  var widget = new Widget();
  widget.body = name;
  widget.id = getNewWidgetId().toString();
  widget.viewerId = viewer.id;
  widget.dateCreated = moment().format();
  return widget;
});

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  getWidget: (id) => widgets.find(w => w.id === id),
  getWidgets: (user) => widgets.filter(w => w.viewerId === user.id),
  getWidgetsCount: (user) => widgets.filter(w => w.viewerId === user.id).length,
  addWidget: (viewerId, body) => {
    const widget = new Widget();
    const id = getNewWidgetId().toString();
    const dateCreated = moment().format();
    widgets.push(Object.assign(widget, { id, dateCreated, viewerId, body}));
    return { widget };
  },
  updateWidget: (widgetId, body) => {
    const dateEdited = moment().format();
    return widgets = widgets.map(w => w.id === widgetId ? Object.assign(w, { body, dateEdited }) : w);
  },

  removeWidget: (widgetId) => {
    const indexToRemove = widgets.indexOf(widgets.filter(w => w.id === widgetId)[0]);
    return widgets.splice(indexToRemove, 1);
  },
  User,
  Widget,
};
