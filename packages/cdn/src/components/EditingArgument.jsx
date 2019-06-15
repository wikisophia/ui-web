import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * An EditingArgument shows an argument in the process of being edited.
 *
 * For the "static" view, see StaticArgument.jsx.
 */
EditingArgument.propTypes = {
  // The initial premises & conclusion in the editor.
  initialArgument: PropTypes.shape({
    premises: PropTypes.arrayOf(PropTypes.string).isRequired,
    conclusion: PropTypes.string.isRequired
  }).isRequired,
  // onSave will be called when the user saves.
  // It will be passed an object like { "premises": ["p1", "p2"], "conclusion": "c" }.
  onSave: PropTypes.func.isRequired,
  // onCancel will be called if the user cancels their edits without saving.
  // If undefined, the user won't be able to cancel these edits.
  onCancel: PropTypes.func,
  // onDelete will be called if the user wants to delete this argument completely.
  // If undefined, the user won't be able to delete this argument.
  onDelete: PropTypes.func,
}

export function EditingArgument(props) {
  const [premises, setPremises] = useState(props.initialArgument.premises);
  const [conclusion, setConclusion] = useState(props.initialArgument.conclusion);

  const undoConclusion = props.initialArgument.conclusion !== '' && conclusion !== props.initialArgument.conclusion
    ? (<div tabIndex="0" className="undo control conclusion" onClick={() => setConclusion(props.initialArgument.conclusion)}>undo</div>)
    : null;

  const deleteNode = props.onDelete
    ? (<button className="delete control" type="button" onClick={props.onDelete}>Delete</button>)
    : null;

  const cancelNode = props.onCancel
    ? (<button className="cancel control" type="button" onClick={props.onCancel}>Cancel</button>)
    : null;

  return (
    <div className="argument-area">
      <h1 className="suppose">If someone believes that</h1>
      <ul className="premises">
        {renderPremises(props.initialArgument.premises, premises, setPremises)}
        <div tabIndex="0" className="new control" onClick={() => setPremises(oldPremises => oldPremises.concat(['']))}>new</div>
      </ul>
      <h1 className="then">Then they should agree that</h1>
      <div className="conclusion-area">
        <input value={conclusion} onChange={(ev) => setConclusion(ev.target.value)} className="conclusion editing" />
      </div>
      <div className="control-panel">
        <button className="save control" type="button" onClick={() => props.onSave({ premises, conclusion })}>Save</button>
        {cancelNode}
        {deleteNode}
      </div>
    </div>
  )
}

function renderPremises(initialPremises, premises, setPremises) {
  const nodes = premises.map((premise, index) => (
    <input type="text"
           value={premise}
           onChange={premiseChangeHandler(index, setPremises)}
           key={index + '-text'}
           className="premise"
    />
  ));
  const revertButtons = premises.map((premise, index) => {
    if (premises.length > 2) {
      return (<div key={index + '-revert'} tabIndex="0" className="delete control" onClick={premiseDeleter(setPremises, index)}>d</div>)
    } else {
      return null
    }
  });

  return revertButtons.map((revertNode, index) => {
    return [revertNode, nodes[index]];
  }).reduce((prev, current) => current === null ? prev : prev.concat(current), []);
}

function premiseChangeHandler(index, setPremises) {
  return function(ev) {
    const newPremise = ev.target.value;
    setPremises(oldPremises => copyWithElement(oldPremises, index, newPremise));
  }
}

function premiseUndoer(setPremises, index, initialPremise) {
  return function() {
    setPremises(oldPremises => copyWithElement(oldPremises, index, initialPremise));
  }
}

function premiseDeleter(setPremises, index) {
  return function() {
    setPremises(oldPremises => {
      return oldPremises.slice(0, index).concat(oldPremises.slice(index+1));
    });
  };
}

function copyWithElement(arr, index, elm) {
  const copy = arr.slice();
  copy[index] = elm;
  return copy;
}
