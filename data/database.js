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

// Mock data
var viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';
var widgets = ['What\'s-it', 'Who\'s-it', 'How\'s-it'].map((name, i) => {
  var widget = new Widget();
  widget.body = name;
  widget.id = `${i}`;
  widget.viewerId = viewer.id;
  widget.dateCreated = moment().utc();
  return widget;
});

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  getWidget: (id) => widgets.find(w => w.id === id),
  getWidgets: () => widgets,
  addWidget: (viewerId, body) => {
    const widget = new Widget();
    const id = (1 + Number(widgets[widgets.length-1].id)).toString();
    const dateCreated = moment().utc();
    widgets.push(Object.assign(widget, { id, dateCreated, viewerId, body}));
    return widget;
  },
  updateWidget: (widgetId, body) => {
    const dateEdited = moment().utc();
    return widgets = widgets.map(w => w.id === widgetId ? Object.assign(w, { body, dateEdited }) : w);
  },
  User,
  Widget,
};
