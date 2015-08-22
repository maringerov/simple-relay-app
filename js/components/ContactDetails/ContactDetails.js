import { Link } from 'react-router';
import styles from './ContactDetails.less';

class ContactDetails extends React.Component {
  renderContacts() {
    return (
      <ul>
        { this.props.contacts.edges.map(edge =>
          <li key={edge.node.id}>
            <Link to={`/contact/${edge.node.id}`}>
              {edge.node.name}
            </Link>
          </li>
        ) }
      </ul>
    );
  }
  render() {
    return (
      <div className={styles.main}>
        <h4>Contact List ({this.props.contacts.totalCount})</h4>
        {this.renderContacts()}
      </div>
    );
  }
}

export default Relay.createContainer(ContactDetails, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
    contacts: () => Relay.QL`
      fragment on ContactConnection {
        edges {
          node {
            id,
            name,
          },
        },
        totalCount,
      }
    `,
  },
});
