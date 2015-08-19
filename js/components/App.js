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
  render() {
    return <div>
      <h1>Contact Organizer</h1>
      <p>Total contacts: {this.props.viewer.contacts.totalCount}</p>
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
            },
          },
          totalCount,
        },
        ${AddContactMutation.getFragment('viewer')},
      }
    `,
  },
});
