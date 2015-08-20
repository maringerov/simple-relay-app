import styles from './AddContact.less';

const { PropTypes } = React;

export default class AddContact extends React.Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired
  }
  state = {
    name: '',
    email: '',
    phone: '',
    notes: ''
  }
  _handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }
  _handleEmailChange = (e) => {
    this.setState({
      email: e.target.value
    });
  }
  _handlePhoneChange = (e) => {
    this.setState({
      phone: e.target.value
    });
  }
  _handleNotesChange = (e) => {
    this.setState({
      notes: e.target.value
    });
  }
  _handleSubmit = (e) => {
    e.preventDefault();
    const newName = this.state.name;
    const newEmail = this.state.email;
    const newPhone = this.state.phone;
    const newNotes = this.state.notes;
    this.props.onSave(newName, newEmail, newPhone, newNotes);
    this.setState({
      name: '',
      email: '',
      phone: '',
      notes: ''
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
            <input
            type='email'
            placeholder='The email'
            onChange={this._handleEmailChange}
            value={this.state.email}
            ref='email'
          />
          <br />
          <input
            type='text'
            placeholder='The phone number'
            onChange={this._handlePhoneChange}
            value={this.state.phone}
            ref='phone'
          />
          <br />
          <input
            type='text'
            placeholder='The notes'
            onChange={this._handleNotesChange}
            value={this.state.notes}
            ref='notes'
          />
          <br />
          <input type='submit' value='Add Contact' />
        </form>

      </div>
    );
  }
}
