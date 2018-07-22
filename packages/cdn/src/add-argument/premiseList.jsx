
class Premise extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(ev) {
    this.props.onChange(ev.target.value);
  }

  render() {
    return <li className="premise-element">
      <input className="premise-entry" type="text" placeholder="Add premise here" onChange={this.handleChange} value={this.props.premise} />
      <button type="button" className="delete-premise" onClick={this.props.onDelete}>Delete</button>
    </li>;
  }
}

export default class PremiseList extends React.Component {
  render() {
    let premiseElements = this.props.premises.map((premise, i) =>
      <Premise key={premise.id}
               premise={premise.text}
               onChange={this.props.onChange.bind(null, i)}
               onDelete={this.props.onDelete.bind(null, i)}
      />);
    if (premiseElements.length === 0) {
      premiseElements = [<Premise key="0" remove={function() { }} />];
    }
    return <section className="premises">
      <ul className="premise-list">
        {premiseElements}
      </ul>
      <button type="button" className="add-premise" onClick={this.props.onAdd}>New premise</button>
    </section>;
  }
}
