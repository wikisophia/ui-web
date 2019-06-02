import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { EditingArgument } from '../components/EditingArgument';


/**
 * The argument editor manages state for the EditingArgument.
 */

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

export function ArgumentEditor(props) {
  const [premises, setPremises] = useState(props.initialArgument.premises);
  const [conclusion, setConclusion] = useState(props.initialArgument.conclusion);

  return <EditingArgument {...editableArgumentProps(props, premises, setPremises, conclusion, setConclusion)} />;
}

function editableArgumentProps(props, premises, setPremises, conclusion, setConclusion) {
  return {
    premises: premises.map(stateToEditableArgumentPremiseMapper(props, setPremises)),
    onNewPremise: premiseAdder(setPremises),
    conclusion: conclusion,
    onRevertConclusion: conclusionUndoer(props.initialArgument.conclusion, conclusion, setConclusion),
    onChangeConclusion: conclusionChangeHandler(setConclusion),
    onSave: saver(props, premises, conclusion),
    onCancel: props.onCancel,
    onDelete: props.onDelete,
  }
}

function stateToEditableArgumentPremiseMapper(props, setPremises) {
  return function(premise, index, premises) {
    return {
      text: premise,
      onUndo: premiseUndoer(props, index, premises, setPremises),
      onDelete: premiseDeleter(index, setPremises),
      onChange: premiseChanger(index, setPremises),
    }
  }
}

function premiseUndoer(props, index, premises, setPremises) {
  if (index >= props.initialArgument.premises.length) {
    return null;
  }
  if (props.initialArgument.premises[index] === premises[index]) {
    return null;
  }

  return function() {
    setPremises(oldPremises => copyWithElement(oldPremises, index, props.initialArgument.premises[index]));
  }
}

function premiseDeleter(index, setPremises) {
  return function() {
    setPremises(oldPremises => oldPremises.slice(0, index).concat(oldPremises.slice(index+1)));
  };
}

function onDeletePremise(index) {
  this.setState({
    premises: this.state.premises.slice(0, index).concat(
      this.state.premises.slice(index+1)
    )
  })
}

function premiseChanger(index, setPremises) {
  return function(newPremise) {
    setPremises(oldPremises => copyWithElement(oldPremises, index, newPremise));
  }
}

function premiseAdder(setPremises) {
  return function() {
    setPremises(oldPremises => oldPremises.concat(['']));
  };
}

function conclusionUndoer(oldConclusion, conclusion, setConclusion) {
  if (oldConclusion === conclusion) {
    return null;
  }

  return function() {
    setConclusion(conclusion);
  }
}

function undoConclusionHandler() {
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

function conclusionChangeHandler(setConclusion) {
  return function(newConclusion) {
    setConclusion(newConclusion);
  };
}

function saver(props, premises, conclusion) {
  return function() {
    props.onSave({ premises, conclusion });
  };
}

function copyWithElement(arr, index, elm) {
  const copy = arr.slice();
  copy[index] = elm;
  return copy;
}