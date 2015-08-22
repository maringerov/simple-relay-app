import { Link } from 'react-router';
import RemoveContactMutation from '../../mutations/RemoveContactMutation';

class Contact extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.context = context;
  }
  static contextTypes ={
    router: React.PropTypes.object.isRequired
  }
  _handleDelete = () => {
    this._removeContact();
    this.context.router.transitionTo('/');
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
    const { name, email, phone, notes } = this.props.contact;
    return (
      <div>
        <h4><Link to='/'>Back</Link></h4>
        <div>
          {name} | {email} | {phone} | {notes}
          <button onClick={this._handleDelete}>X</button>
        </div>
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
