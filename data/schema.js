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
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  Contact,
  addContact,
  getContact,
  getContacts,
  getUser,
  getViewer,
  updateContact,
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
    } else if (type === 'Contact') {
      return getContact(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return GraphQLUser;
    } else if (obj instanceof Contact) {
      return GraphQLContact;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var GraphQLUser = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: {
    id: globalIdField('User'),
    contacts: {
      type: ContactsConnection,
      description: 'A person\'s collection of contacts',
      args: connectionArgs,
      resolve: (obj, args) => connectionFromArray(getContacts(), args),
    },
  },
  interfaces: [nodeInterface],
});

var GraphQLContact = new GraphQLObjectType({
  name: 'Contact',
  description: 'A contact',
  fields: {
    id: globalIdField('Contact'),
    name: {
      type: GraphQLString,
      description: 'The name of the contact',
    },
    email: {
      type: GraphQLString,
      description: 'The email of the contact',
    },
    phone: {
      type: GraphQLString,
      description: 'The phone number of the contact',
    },
    notes: {
      type: GraphQLString,
      description: 'A reminder how you know this contact',
    },
  },
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
var {
  connectionType: ContactsConnection,
  edgeType: GraphQLContactEdge,
} = connectionDefinitions({
  name: 'Contact',
  nodeType: GraphQLContact,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      resolve: (conn) => conn.edges.length,
    },
  })
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer()
    },
    node: nodeField,
  },
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var GraphQLAddContactMutation = mutationWithClientMutationId({
  name: 'AddContact',
  inputFields: {
    name: { name: new GraphQLNonNull(GraphQLString) },
    email: { email: new GraphQLNonNull(GraphQLString) },
    phone: { phone: new GraphQLNonNull(GraphQLString) },
    notes: { notes: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    contactEdge: {
      type: GraphQLContactEdge,
      resolve: ({localContactId}) => {
        var contact = getContact(localContactId);
        return {
          cursor: cursorForObjectInConnection(getContacts(), contact),
          node: contact,
        };
      }
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({name, email, phone, notes}) => {
    var localContactId = addContact(name, email, phone, notes);
    return {localContactId};
  }
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
