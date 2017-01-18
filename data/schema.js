 /**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromPromisedArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  getUser,
  getViewer,
} from './database';

const { ObjectID } = require('mongodb')

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */

const globalIdFetcher = (globalId, { db }) => {
  const { type, id } = fromGlobalId(globalId)
  switch (type) {
    case 'User':
      return getUser(id);
    case 'Quote':
      return db.collection('quotes').findOne(ObjectID(id))
    default:
      return null
  }
}

// const globalTypeResolver = obj => obj.type || quoteType

const globalTypeResolver = obj => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Quote)  {
      return quoteType;
    } else {
      return null;
    }
  }
const { nodeInterface, nodeField } = nodeDefinitions(
  globalIdFetcher,
  globalTypeResolver
)

/**
 * Define your own types here
 */

const quoteType = new GraphQLObjectType({
  name: 'Quote',
  fields: () => ({
    id: globalIdField('Quote', obj => obj._id),
    text: { type: GraphQLString },
    author: { type: GraphQLString },
    likesCount: {
      type: GraphQLInt,
      resolve: obj => obj.likesCount || 0,
    },
  }),
  interfaces: () => [nodeInterface],
})

let connectionArgsWithSearch = connectionArgs

connectionArgsWithSearch.searchTerm = { type: GraphQLString }

/**
 * Define your own connection types here
 */
const { connectionType: QuotesConnectionType } = connectionDefinitions({
  name: 'Quote',
  nodeType: quoteType,
})

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User', obj => obj._id),
    quotes: {
      type: QuotesConnectionType,
      description: 'A list of the quotes in the database',
      args: connectionArgsWithSearch,
      resolve: (_, args, { db }) => {
        let findParams = {}
        if (args.searchTerm) {
          findParams.text = new RegExp(args.searchTerm, 'i')
        }
        return connectionFromPromisedArray(
          db.collection('quotes').find(findParams).toArray(),
          args
        )
      },
    },
  }),
  interfaces: () => [nodeInterface],
});

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
const thumbsUpMutation = mutationWithClientMutationId({
  name: 'ThumbsUpMutation',
  inputFields: {
    quoteId: { type: GraphQLString },
  },
  outputFields: {
    quote: {
      type: quoteType,
      resolve: obj => obj,
    },
  },
  mutateAndGetPayload: (params, { db }) => {
    const { id } = fromGlobalId(params.quoteId)
    return Promise.resolve(
      db.collection('quotes').updateOne({ _id: ObjectID(id) },
        { $inc: { likesCount: 1 } }
      )
    ).then(result =>
    db.collection('quotes').findOne(ObjectID(id)))
  },
})

const mutationType = new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => ({
    thumbsUp: thumbsUpMutation,
  }),
})

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  mutation: mutationType,
});
