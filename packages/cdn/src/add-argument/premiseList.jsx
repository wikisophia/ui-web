
class Premise extends React.Component {
  render() {
    return <li className="premise-element">
      <input className="premise-entry" type="text" placeholder="Add premise here" value={this.props.premise} />
      <button type="button" className="delete-premise" onClick={this.props.remove()}>Delete</button>
    </li>;
  }
}

export default class PremiseList extends React.Component {
  render() {
    let premiseElements = this.props.premises.map((premise, i) => <Premise key={premise.id} premise={premise.text} remove={this.props.delete.bind(null, i)}/>);
    if (premiseElements.length === 0) {
      premiseElements = [<Premise key="0" remove={function() { }} />];
    }
    return <div>
      {premiseElements}
    </div>;
  }
}


let premiseCounter = 0;
export function newPremise(premiseText) {
  return {
    text: premiseText,
    id: premiseCounter++
  };
}