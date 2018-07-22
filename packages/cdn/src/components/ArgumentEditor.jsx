export default class ArgumentEditor extends React.Component {
  // props.onSave: function(argument), where argument has a conclusion and an array with at least 2 premise strings
  // props.conclusion: string
  // props.premises: string[]
  constructor(props) {
    super(props);

    this.state = {
      conclusion: props.conclusion,
      premises: premisesToState(props.premises),
    };

    this.addPremise = this.addPremise.bind(this);
    this.deletePremise = this.deletePremise.bind(this);
    this.handlePremiseChange = this.handlePremiseChange.bind(this);
    this.handleConclusionChange = this.handleConclusionChange.bind(this);
  }

  deletePremise(index) {
    this.setState((prevState) => {
      let newPremises = prevState.premises.slice(0, index).concat(prevState.premises.slice(index+1))
      if (newPremises.length < 1) {
        newPremises = [newPremise(""), newPremise("")];
      }
      return {
        premises: newPremises
      };
    });
  }

  addPremise() {
    this.setState((prevState) => {
      return {
        premises: prevState.premises.concat([newPremise("")])
      };
    })
  }

  handlePremiseChange(index, newText) {
    this.setState((prevState) => {
      const copy = prevState.premises.slice()
      copy[index].text = newText
      return {
        premises: copy
      };
    })
  }

  handleConclusionChange(newText) {
    this.setState({
      conclusion: newText
    });
  }

  render() {
    const argument = {
      conclusion: this.state.conclusion,
      premises: this.state.premises.map((premise) => premise.text),
    }
    return (
      <div>
        <Conclusion conclusion={this.state.conclusion} onChange={this.handleConclusionChange} />
        <p>because...</p>
        <PremiseList premises={this.state.premises} onAdd={this.addPremise} onDelete={this.deletePremise} onChange={this.handlePremiseChange}/>
        <button type="button" className="save-argument" onClick={this.props.onSave.bind(null, argument)}>Save</button>
        <p id="save-error" className="save-error"></p>
      </div>
    );
  }
}

class Conclusion extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(ev) {
    this.props.onChange(ev.target.value);
  }

  render() {
    return <section className="conclusion">
      <input className="conclusion-entry" type="text" placeholder="Set conclusion here" onChange={this.handleChange} value={this.props.conclusion} />
    </section>;
  }
}

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

class PremiseList extends React.Component {
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

let premiseCounter = 0;
function newPremise(premiseText) {
  return {
    text: premiseText,
    id: premiseCounter++
  };
}

function premisesToState(premisesProps) {
  if (!premisesProps || premisesProps.length < 1) {
    return [newPremise(""), newPremise("")];
  }
  return premisesProps.map(newPremise);
}