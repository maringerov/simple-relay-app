const { PropTypes } = React;

class Contact extends React.Component {
  static propTypes = {
    contact: PropTypes.object.isRequired
  }
  render() {
    const { name, email, phone, notes } = this.props;
    return (
      <div>
        {name} | {email} | {phone} | {notes}
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
      }
    `,
  },
});
