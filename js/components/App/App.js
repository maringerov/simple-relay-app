import styles from './App.less';
import AddContactMutation from '../../mutations/AddContactMutation';
import AddContact from '../AddContact/AddContact';
import ContactList from '../ContactList/ContactList';

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
    return (
      <div className={styles.app}>
        <header>
          <h1>Contact Organizer</h1>
          <p>Total contacts: {this.props.viewer.contacts.totalCount}</p>
        </header>
        <div>
          <AddContact onSave={this._handleAddContactSave}/>
        </div>
        <div>
          <ContactList
            contacts={this.props.viewer.contacts}
            viewer={this.props.viewer}
          />
        </div>
      </div>
    );
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
