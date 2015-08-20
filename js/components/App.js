import AddContactMutation from '../mutations/AddContactMutation';
import AddContact from './AddContact/AddContact';
import ContactDetails from './ContactDetails/ContactDetails';

class App extends React.Component {
  _handleAddContactSave = (name, email, phone, notes) => {
    Relay.Store.update(
      new AddContactMutation({
        name,
        email,
        phone,
        notes,
        viewer: this.props.viewer
      })
    );
  }
  renderContactNames() {
    return this.props.viewer.contacts.edges.map(edge =>
      <li key={edge.node.id}>{edge.node.name}</li>
    );
  }
  render() {
    return <div>
      <h1>Contact Organizer</h1>
      <p>Total contacts: {this.props.viewer.contacts.totalCount}</p>
      <ul>{this.renderContactNames()}</ul>
      <AddContact onSave={this._handleAddContactSave}/>
      <ContactDetails
        contacts={this.props.viewer.contacts}
        viewer={this.props.viewer}
      />
    </div>;
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        contacts(first: 123131) {
          edges {
            node {
              id,
              name,
            },
          },
          totalCount,
          ${ContactDetails.getFragment('contacts')},
        },
        ${AddContactMutation.getFragment('viewer')},
      }
    `,
  },
});
