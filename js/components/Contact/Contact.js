const { PropTypes } = React;

class Contact extends React.Component {
  static propTypes = {
    contact: PropTypes.object.isRequired
  }
  render() {
    const { name } = this.props.contact;
    return (
      <div>
        Name: {name}
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
      }
    `,
  },
});
