import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
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
  removeContact,
} from './database';

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    let {type, id} = fromGlobalId(globalId);
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

const GraphQLContact = new GraphQLObjectType({
  name: 'Contact',
  description: 'A contact',
  fields: {
    id: globalIdField('Contact'),
    name: {
      type: GraphQLString,
      description: 'The name of the contact',
      resolve: (obj) => obj.name,
    },
    email: {
      type: GraphQLString,
      description: 'The email of the contact',
      resolve: (obj) => obj.email,
    },
    phone: {
      type: GraphQLString,
      description: 'The phone number of the contact',
      resolve: (obj) => obj.phone,
    },
    notes: {
      type: GraphQLString,
      description: 'A reminder how you know this contact',
      resolve: (obj) => obj.notes,
    },
  },
  interfaces: [nodeInterface],
});

const {
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

const GraphQLUser = new GraphQLObjectType({
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

const Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer()
    },
    node: nodeField,
  },
});

const GraphQLAddContactMutation = mutationWithClientMutationId({
  name: 'AddContact',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: new GraphQLNonNull(GraphQLString) },
    notes: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    contactEdge: {
      type: GraphQLContactEdge,
      resolve: ({localContactId}) => {
        let contact = getContact(localContactId);
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
    let localContactId = addContact(name, email, phone, notes);
    return {localContactId};
  }
});

const GraphQLRemoveContactMutation = mutationWithClientMutationId({
  name: 'RemoveContact',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedContactId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({id}) => {
    let localContactId = fromGlobalId(id).id;
    removeContact(localContactId);
    return {id};
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addContact: GraphQLAddContactMutation,
    removeContact: GraphQLRemoveContactMutation,
  },
});

export const Schema = new GraphQLSchema({
  query: Root,
  mutation: Mutation
});
