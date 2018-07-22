import Conclusion from './conclusion';
import PremiseList from './premiseList';

export class NewArgument extends React.Component {
  // props.apiAuthority: string
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
    this.save = this.save.bind(this);
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

  save() {
    const ajax = new XMLHttpRequest();
    ajax.timeout = 1000;
    ajax.addEventListener('readystatechange', () => {
      if (ajax.readyState === 2) {
        if (ajax.status >= 200 && ajax.status < 300) {
          window.location = ajax.getResponseHeader('Location');
        } else if (ajax.status >= 400 && ajax.status < 500) {
          this.setState({saveError: `Could not save argument. Server responded with ${ajax.status}. Please report this bug.`});
        } else {
          this.setState({saveError: `Could not save argument. Server responded with ${ajax.status}. Try again later. If this problem persists, please report it.`});
        }
      }
    });
    ajax.open('POST', `//${this.props.apiAuthority}/arguments`, true);
    ajax.setRequestHeader('Content-Type', 'application/json');
    ajax.send(JSON.stringify({
      conclusion: this.state.conclusion,
      premises: this.state.premises.map((premise) => premise.text),
    }));
  }

  render() {
    return (
      <div>
        <Conclusion conclusion={this.state.conclusion} onChange={this.handleConclusionChange} />
        <p>because...</p>
        <PremiseList premises={this.state.premises} onAdd={this.addPremise} onDelete={this.deletePremise} onChange={this.handlePremiseChange}/>
        <button type="button" className="save-argument" onClick={this.save}>Save</button>
        <p id="save-error" className="save-error"></p>
      </div>
    );
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