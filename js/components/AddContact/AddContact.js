import styles from './AddContact.less';

const { PropTypes } = React;

export default class AddContact extends React.Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired
  }
  state = {
    name: ''
  }
  _handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }
  _handleSubmit = (e) => {
    e.preventDefault();
    const newName = this.state.name;
    this.props.onSave(newName);
    this.setState({
      name: ''
    });
  }
  render() {
    return (
      <div className={styles.main}>
        <h4>Add Contact</h4>
        <form onSubmit={this._handleSubmit}>
          <input
            type='text'
            placeholder='The name'
            onChange={this._handleNameChange}
            value={this.state.name}
            ref='name'
          />
          <br />
          <input type='submit' value='Add Contact' />
        </form>

      </div>
    );
  }
}
