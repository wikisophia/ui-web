import { EditingArgument } from '../components/EditingArgument';

/**
 * The ArgumentEditor tracks all the changes the user makes
 * so they can be saved later.
 */
export class ArgumentEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      premises: props.initialArgument.premises,
      conclusion: props.initialArgument.conclusion
    }
  }

  render() {
    return <EditingArgument {...this.editableArgumentProps()} />;
  }

  editableArgumentProps() {
    return {
      premises: this.state.premises.map(this.stateToEditableArgumentPremise.bind(this)),
      onNewPremise: this.onNewPremise.bind(this),
      conclusion: this.state.conclusion,
      onRevertConclusion: this.undoConclusionHandler(),
      onChangeConclusion: this.onChangeConclusion.bind(this),
      onSave: this.onSave.bind(this),
      onCancel: this.props.onCancel,
      onDelete: this.props.onDelete,
    }
  }

  stateToEditableArgumentPremise(premise, index) {
    return {
      text: premise,
      onUndo: this.undoPremiseHandler(index),
      onDelete: this.onDeletePremise.bind(this, index),
      onChange: this.onChangePremise.bind(this, index),
    }
  }

  undoPremiseHandler(index) {
    if (index >= this.props.initialArgument.premises.length) {
      return null;
    }
    if (this.props.initialArgument.premises[index] === this.state.premises[index]) {
      return null;
    }

    const self = this;
    return function() {
      self.setState({
        premises: copyWithElement(
          self.state.premises,
          index,
          self.props.initialArgument.premises[index]
        )
      });
    }
  }

  onDeletePremise(index) {
    this.setState({
      premises: this.state.premises.slice(0, index).concat(
        this.state.premises.slice(index+1)
      )
    })
  }

  onChangePremise(index, newPremise) {
    this.setState({
      premises: copyWithElement(this.state.premises, index, newPremise)
    });
  }

  onNewPremise() {
    this.setState({
      premises: this.state.premises.concat([''])
    });
  }

  undoConclusionHandler() {
    if (this.props.initialArgument.conclusion === this.state.conclusion) {
      return null;
    }

    const self = this;
    return function() {
      self.setState({
        conclusion: self.props.initialArgument.conclusion
      });
    }
  }

  onChangeConclusion(newConclusion) {
    this.setState({
      conclusion: newConclusion
    });
  }

  onSave() {
    this.props.onSave({
      premises: this.state.premises,
      conclusion: this.state.conclusion
    })
  }
}

ArgumentEditor.propTypes = {
  // The initial premises & conclusion in the editor.
  initialArgument: PropTypes.shape({
    premises: PropTypes.arrayOf(PropTypes.string).isRequired,
    conclusion: PropTypes.string.isRequired
  }),
  // onSave will be called when the user saves.
  // It will be passed an object like { "premises": ["p1", "p2"], "conclusion": "c" }.
  onSave: PropTypes.func.isRequired,
  // onCancel will be called if the user cancels their edits without saving.
  // If undefined, the user won't be able to cancel these edits.
  onCancel: PropTypes.func,
  // onDelete will be called if the user wants to delete this argument completely.
  // If undefined, the user won't be able to delete this argument.
  onDelete: PropTypes.func,
};

function copyWithElement(arr, index, elm) {
  const copy = arr.slice();
  copy[index] = elm;
  return copy;
}