/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  Widget,
  getUser,
  getViewer,
  getWidget,
  getWidgets,
  getWidgetsCount,
  addWidget,
  updateWidget,
  removeWidget,
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Widget') {
      return getWidget(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Widget)  {
      return widgetType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    widgets: {
      type: widgetConnection,
      description: 'A person\'s collection of widgets',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getWidgets(_), args),
    },
    widgetsCount: {
      type: GraphQLInt,
      description: 'Count on a person\'s collection of widgets',
      args: connectionArgs,
      resolve: (_, args) => getWidgetsCount(_),
    },
    name: {
      type: GraphQLString,
      description: 'Name of the user',
    },
  }),
  interfaces: [nodeInterface],
});

var widgetType = new GraphQLObjectType({
  name: 'Widget',
  description: 'A shiny widget',
  fields: () => ({
    id: globalIdField('Widget'),
    viewerId: globalIdField('User'),
    body: {
      type: GraphQLString,
      description: 'the content',
    },
    dateCreated: {
      type: GraphQLString,
      description: 'creationDate',
    },
    dateEdited: {
      type: GraphQLString,
      description: 'lastEditedDate',
    },
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
var {connectionType: widgetConnection} =
  connectionDefinitions({name: 'Widget', nodeType: widgetType});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */

const AddWidgetMutation = mutationWithClientMutationId({
  name: 'AddWidget',
  inputFields: {
    viewerId: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: getViewer,
    },
    widgets: {
      type: widgetConnection,
      description: 'A person\'s collection of widgets',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getWidgets(), args),
    },
  },
  mutateAndGetPayload: (payload) => {
    const widgetId = addWidget(fromGlobalId(payload.viewerId).id, payload.body).id;
    return { widgetId };
  },
});

const UpdateWidgetMutation = mutationWithClientMutationId({
  name: 'UpdateWidget',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    body: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    widget: {
      type: widgetType,
      resolve: ({ widgetId }) => {
        return getWidget(widgetId)
      },
    },
  },
  mutateAndGetPayload: ({ id, body }) => {
    const { id: widgetId } = fromGlobalId(id);
    updateWidget(widgetId, body);
    return { widgetId };
  },
});

const RemoveWidgetMutation = mutationWithClientMutationId({
  name: 'RemoveWidget',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: getViewer,
    },
    deletedId: {
      type: GraphQLID,
      resolve: ({ id }) => id,
    },
  },
  mutateAndGetPayload: ({ id }) => {
    const { id: widgetId } = fromGlobalId(id);
    removeWidget(widgetId);
    return { id };
  },
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addWidget: AddWidgetMutation,
    updateWidget: UpdateWidgetMutation,
    removeWidget: RemoveWidgetMutation,
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
