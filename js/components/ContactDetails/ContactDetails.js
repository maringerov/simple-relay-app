import styles from './ContactDetails.less';
import Contact from '../Contact/Contact';

class ContactDetails extends React.Component {
  renderContacts() {
    return this.props.contacts.edges.map(edge =>
        <Contact
          key={edge.node.id}
          contact={edge.node}
          viewer={this.props.viewer}
        />
    );
  }
  render() {
    return (
      <div className={styles.main}>
        Contact Details ({this.props.contacts.totalCount})
        <br/>***
        {this.renderContacts()}
      </div>
    );
  }
}

export default Relay.createContainer(ContactDetails, {
  fragments: {
    contacts: () => Relay.QL`
      fragment on ContactConnection {
        edges {
          node {
            id,
            ${Contact.getFragment('contact')},
          },
        },
        totalCount,
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        ${Contact.getFragment('viewer')}
      }
    `,
  },
});
