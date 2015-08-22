import { Link } from 'react-router';
export default class More extends React.Component {
  render() {
    return (
      <div>
        More page
        <Link to='/'>Back</Link>
      </div>
    );
  }
}
