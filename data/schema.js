import {
  GraphQLInt,
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
} from 'graphql-relay';

import {
  User,
  Contact,
  addContact,
  getContact,
  getContacts,
  getUser,
  getViewer,
} from './database';

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

var GraphQLContact = new GraphQLObjectType({
  name: 'Contact',
  description: 'A contact',
  fields: {
    id: globalIdField('Contact'),
    name: {
      type: GraphQLString,
      description: 'The name of the contact',
      resolve: (obj) => obj.name,
    },
  },
  interfaces: [nodeInterface],
});

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

var GraphQLAddContactMutation = mutationWithClientMutationId({
  name: 'AddContact',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
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
  mutateAndGetPayload: ({name}) => {
    var localContactId = addContact(name);
    return {localContactId};
  }
});

var Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addContact: GraphQLAddContactMutation,
  },
});

export var Schema = new GraphQLSchema({
  query: Root,
  mutation: Mutation
});
