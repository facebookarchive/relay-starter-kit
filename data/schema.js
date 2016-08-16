/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * schema.js
 */
import {GraphQLObjectType} from "../node_modules/graphql/type/definition";
import {GraphQLBoolean} from "../node_modules/graphql/type/scalars";
import {connectionArgs} from "../node_modules/graphql-relay/lib/connection/connection";
import {GraphQLInt} from "../node_modules/graphql/type/scalars";
import {GraphQLSchema} from "../node_modules/graphql/type/schema";
import {GraphQLNonNull} from "../node_modules/graphql/type/definition";

import {connectionFromArray} from "../node_modules/graphql-relay/lib/connection/arrayconnection";
import {nodeDefinitions} from "../node_modules/graphql-relay/lib/node/node";
import {fromGlobalId} from "../node_modules/graphql-relay/lib/node/node";
import {globalIdField} from "../node_modules/graphql-relay/lib/node/node";
import {connectionDefinitions} from "../node_modules/graphql-relay/lib/connection/connection";
import {mutationWithClientMutationId} from "../node_modules/graphql-relay/lib/mutation/mutation";

import {
    Game,
    HidingSpot,
    checkHidingSpotForTreasure,
    getGame,
    getHidingSpot,
    getHidingSpots,
    getTurnsRemaining,
} from './database';
import {GraphQLID} from "../node_modules/graphql/type/scalars";


/**
 * Provides a way for relay to map from an object to the GraphQL type.
 * <p>
 *     Need only provide:
 *     <ul>
 *         <li>from a global ID to the object it points to</li>
 *         <li>a way for Relay to map from an object to the GraphQL type associated with that object</li>
 *     </ul>
 * </p>
 *
 * @type {{nodeInterface, nodeField}|*}
 */
var {nodeInterface, nodeField} = nodeDefinitions(
    (globalId) => {
        var {type, id} = fromGlobalId(globalId);
        if (type === 'Game') {
            return getGame(id);
        } else if (type === 'HidingSpot') {
            return getHidingSpot(id);
        } else {
            return null;
        }
    },
    (obj) => {
        if (obj instanceof Game) {
            return gameType;
        } else if (obj instanceof HidingSpot) {
            return hidingSpotType;
        } else {
            return null;
        }
    }
);

/**
 * GraphQL type representing the Game
 */
var gameType = new GraphQLObjectType({
    name: 'Game',
    description: 'A treasure search game',
    fields: () => ({
        id: globalIdField('Game'),
        hidingSpots: {
            type: hidingSpotConnection,
            description: 'Places where treasure might be hidden',
            args: connectionArgs,
            resolve: (game, args) => connectionFromArray(getHidingSpots(), args)
        },
        turnsRemaining: {
            type: GraphQLInt,
            description: 'The number of turns a player has left to find the treasure',
            resolve: () => getTurnsRemaining()
        },
    }),
    interfaces: [nodeInterface]
});

/**
 * GraphQL type representing the Game
 */
var hidingSpotType = new GraphQLObjectType({
    name: 'HidingSpot',
    description: 'A place where you might find treasure',
    fields: () => ({
        id: globalIdField('HidingSpot'),
        hasBeenChecked: {
            type: GraphQLBoolean,
            description: 'True if this spot has already been checked for treasure',
            resolve: (hidingSpot) => hidingSpot.hasBeenChecked,
        },
        hasTreasure: {
            type: GraphQLBoolean,
            description: 'True if this hiding spot holds treasure',
            resolve: (hidingSpot) => {
                if (hidingSpot.hasBeenChecked) {
                    return hidingSpot.hasTreasure;
                } else {
                    return null;  // Shh... it's a secret!
                }
            },
        },
    }),
    interfaces: [nodeInterface]
});

var {connectionType: hidingSpotConnection} =
    connectionDefinitions({name: 'HidingSpot', nodeType: hidingSpotType});

/**
 * Root query type.
 * <p>
 *     This is the type that will be the root of our query, and the entry point into our schema.
 * </p>
 */
var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        node: nodeField,
        game: {
            type: gameType,
            resolve: () => getGame()
        }
    })
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        checkHidingSpotForTreasure: CheckHidingSpotForTreasureMutation
        // Add/associate additional mutations here
    })
});

/**
 * Mutation that spends a turn by checking a spot for treasure.
 * <p>
 *    Define the input to the mutation (the id of a spot to check for treasure) and a list of all of possible
 *    fields that the client may want updated about after the mutation has completed.
 * </p>
 * <p>
 *    Finally, implement a method that performs the underlying mutation.
 * </p>
 *
 * @type {{type, args, resolve}|*}
 */
var CheckHidingSpotForTreasureMutation = mutationWithClientMutationId({
    name: 'CheckHidingSpotForTreasure',
    inputFields: {
        id: {type: new GraphQLNonNull(GraphQLID)}
    },
    outputFields: {
        hidingSpot: {
            type: hidingSpotType,
            resolve: ({localHidingSpotId}) => getHidingSpot(localHidingSpotId)
        },
        game: {
            type: gameType,
            resolve: () => getGame()
        }
    },
    mutateAndGetPayload: ({id}) => {
        var localHidingSpotId = fromGlobalId(id).id;
        checkHidingSpotForTreasure(localHidingSpotId);
        return {localHidingSpotId};
    }
});

/**
 * Finally, construct the schema (whose starting query type is the query type defined above) and export it.
 */
export var Schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
});
