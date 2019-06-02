import React from 'react';
import PropTypes from 'prop-types';

/**
 * An EditingArgument shows an argument in the process of being edited.
 *
 * For the "static" view, see StaticArgument.jsx.
 */
EditingArgument.propTypes = {
  // premises make an argument for the conclusion
  premises: PropTypes.arrayOf(PropTypes.shape({
    // text is the premise itself
    text: PropTypes.string.isRequired,

    // onUndo will be called if the user wants to revert this premise to
    // its original state. This should be undefined if there's no original
    // state to go back to (e.g. no edits made yet or the premise didn't exist originally)
    onUndo: PropTypes.func,

    // onDelete will be called if the user wants to delete this premise.
    onDelete: PropTypes.func.isRequired,

    // onChange will be called whenever the user edits this premise.
    // The premise text will be passed as an argument.
    onChange: PropTypes.func.isRequired,
  })).isRequired,

  // onNewPremise will be called if the user wants to add
  // a new premise to the argument.
  onNewPremise: PropTypes.func.isRequired,

  // The argument's conclusion
  conclusion: PropTypes.string.isRequired,

  // onRevertConclusion will be called if the user wants to revert the
  // conclusion to its original value. If undefined, the user shouldn't
  // have edited the  conclusion yet.
  onRevertConclusion: PropTypes.func,

  // onChangeConclusion will be called whenever the user edits the conclusion.
  // The conclusion text will be passed as an argument.
  onChangeConclusion: PropTypes.func.isRequired,

  // onSave will be called if the user wants to save this argument as is.
  onSave: PropTypes.func.isRequired,

  // onCancel will be called if the user wants to cancel all their edits
  // without saving them. If undefined, the user won't be able to cancel this edit.
  onCancel: PropTypes.func,

  // onDelete will be called if the user wants to delete this argument completely.
  // If undefined, the user won't be able to delete this argument.
  onDelete: PropTypes.func,
};

export function EditingArgument(props) {
  const undoConclusion = props.onRevertConclusion
    ? (<div tabIndex="0" className="undo control conclusion" onClick={props.onRevertConclusion}>undo</div>)
    : (<div className="spacer control conclusion">s</div>);

  const deleteNode = props.onDelete
    ? (<button className="delete control footer" type="button" onClick={props.onDelete}>delete</button>)
    : null;

  const cancelNode = props.onCancel
    ? (<button className="cancel control footer" type="button" onClick={props.onCancel}>cancel</button>)
    : null;

  return (
    <div className="argument-area">
      <h1 className="suppose">If someone believes that</h1>
      <ul className="premises">
        {renderPremises(props)}
        <div tabIndex="0" className="new control premise" onClick={props.onNewPremise}>new</div>
      </ul>
      <h1 className="then">Then they should agree that</h1>
      {undoConclusion}
      <input value={props.conclusion} onChange={extractValueThen(props.onChangeConclusion)} className="conclusion" />
      <button className="save control footer" type="button" onClick={props.onSave}>save</button>
      {cancelNode}
      {deleteNode}
    </div>
  )
}

function renderPremises(props) {
  const premises = props.premises;
  const nodes = premises.map((premise, index) => (
    <input type="text"
           value={premise.text}
           onChange={extractValueThen(premise.onChange)}
           key={index + '-text'}
           className="premise"
    />
  ));
  const revertButtons = premises.map((premise, index) => {
    if (premise.onUndo) {
      return (<div key={index + '-revert'} tabIndex="0" className="undo control" onClick={premise.onUndo}>u</div>);
    } else if (premises.length > 2) {
      return (<div key={index + '-revert'} tabIndex="0" className="delete control" onClick={premise.onDelete}>d</div>)
    } else {
      return (<div key={index + '-spacer'} className="spacer control">s</div>)
    }
  });

  return revertButtons.map((revertNode, index) => {
    return [revertNode, nodes[index]];
  }).reduce((prev, current) => prev.concat(current), []);
}

// transform a "string" callback into an "event payload" one.
// converts our component's onChange handlers into <input> tag ones.
function extractValueThen(handle) {
  return function (ev) {
    handle(ev.target.value);
  }
}