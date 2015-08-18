export default class AddContactMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL `
      fragment on User {
        id,
        contacts {
          totalCount,
        },
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{addContact}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddContactPayload {
        contactEdge,
        viewer {
          contacts {
            totalCount,
          },
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'contacts',
      edgeName: 'contactEdge',
      rangeBehaviours: {
        '': 'append',
      },
    }];
  }
  getVariables() {
    return {
      name: this.props.name,
      email: this.props.email,
      phone: this.props.phone,
      notes: this.props.notes,
    };
  }
  getOptimisticResponse() {
    return {
      contactEdge: {
        node: {
          name: this.props.name,
          email: this.props.email,
          phone: this.props.phone,
          notes: this.props.notes,
        },
      },
      viewer: {
        id: this.props.viewer.id,
        contacts: {
          totalCount: this.props.viewer.contacts.totalCount + 1,
        },
      },
    };
  }
}
