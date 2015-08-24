import AddContactMutation from '../mutations/AddContactMutation';
import AddContact from './AddContact/AddContact';
import ContactList from './ContactList/ContactList';

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
  render() {
    return <div>
      <h1>Contact Organizer</h1>
      <p>Total contacts: {this.props.viewer.contacts.totalCount}</p>
      <AddContact onSave={this._handleAddContactSave}/>
      <ContactList
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
            },
          },
          totalCount,
          ${ContactList.getFragment('contacts')},
        },
        ${AddContactMutation.getFragment('viewer')},
        ${ContactList.getFragment('viewer')},
      }
    `,
  },
});
