export default class RemoveContactMutation extends Relay.Mutation {
  static fragments = {
    contact: () => Relay.QL`
      fragment on Contact {
        id,
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        id,
        contacts {
          totalCount,
        },
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{removeContact}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveContactPayload {
        deletedContactId,
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
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'contacts',
      deletedIDFieldName: 'deletedContactId',
    }];
  }
  getVariables() {
    return {
      id: this.props.contact.id
    };
  }
  getOptimisticResponse() {
    let viewerPayload;
    const { viewer } = this.props;
    if (viewer.contacts) {
      viewerPayload = { id: viewer.id, contacts: {} };
      if (viewer.contacts.totalCount != null) {
        viewerPayload.contacts.totalCount = viewer.contacts.totalCount - 1;
      }
    }
    return {
      deletedContactId: this.props.contact.id,
      viewer: viewerPayload,
    };
  }
}
