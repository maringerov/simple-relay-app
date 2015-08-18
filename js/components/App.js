import AddContactMutation from '../mutations/AddContactMutation';

class App extends React.Component {
  render() {
    return <div>
      <h1>Contact Organizer</h1>
      <p>Total contacts: {this.props.viewer.contacts.totalCount}</p>
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
        },
        ${AddContactMutation.getFragment('viewer')},
      }
    `,
  },
});
