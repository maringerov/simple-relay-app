import { Link } from 'react-router';
import RemoveContactMutation from '../../mutations/RemoveContactMutation';

class Contact extends React.Component {
  _handleDelete = () => {
    this._removeContact();
  }
  _removeContact() {
    Relay.Store.update(
      new RemoveContactMutation({
        contact: this.props.contact,
        viewer: this.props.viewer
      })
    );
  }
  render() {
    const { id, name, email, phone, notes } = this.props.contact;
    return (
      <div>
        {name} | {email} | {phone} | {notes} |
        <Link to={`/contact/${id}`}>
          More details...
        </Link>
        <button onClick={this._handleDelete}>X</button>
      </div>
    );
  }
}

export default Relay.createContainer(Contact, {
  fragments: {
    contact: () => Relay.QL`
      fragment on Contact {
        id,
        name,
        email,
        phone,
        notes,
        ${RemoveContactMutation.getFragment('contact')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        ${RemoveContactMutation.getFragment('viewer')},
      }
    `,
  },
});
