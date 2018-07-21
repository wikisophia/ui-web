import Conclusion from './conclusion';
import PremiseList, { newPremise } from './premiseList';

export class NewArgument extends React.Component {
  // props.apiAuthority: string
  // props.conclusion: string
  // props.premises: string[]
  constructor(props) {
    super(props);
    this.state = {
      conclusion: props.conclusion,
      premises: props.premises.map(newPremise) || [],
    };
  }

  deletePremise(index) {
    this.setState((prevState) => {
      return prevState.premises.slice(0, index).concat(prevState.premises.slice(index+1))
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
      conclusion,
      premises,
    }));
  }

  render() {
    return (
      <div>
        <Conclusion conclusion={this.props.conclusion} />
        <p>because...</p>
        <PremiseList premises={this.props.premises} delete={this.deletePremise}/>
        <button type="button" className="save-argument" onClick={this.save}>Save</button>
        <p id="save-error" className="save-error"></p>
      </div>
    );
  }
}
