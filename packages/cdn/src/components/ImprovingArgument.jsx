import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';

/**
 * An ImprovingArgument shows an argument in the process of being edited.
 *
 * For the "static" view, see StaticArgument.jsx.
 */
ImprovingArgument.propTypes = {
  // Premise fields' initial values
  initialPremises: PropTypes.arrayOf(PropTypes.string),

  // Conclusion field's initial value.
  initialConclusion: PropTypes.string,

  // Callback executed if the user cancels their edit.
  // If undefined, they won't be allowed to cancel.
  onCancel: PropTypes.func,

  // Callback executed if the user saves their changes.
  // It will be passed an object like:
  //
  // {
  //    premises: [ 'foo', 'bar' ],
  //    conclusion: 'baz'
  // }
  //
  // with the data the user tried to save.
  onSave: PropTypes.func.isRequired,
};

ImprovingArgument.defaultProps = {
  initialPremises: ['', ''],
  initialConclusion: '',
  onCancel: null,
};

function updatePremises(oldPremises, action) {
  switch (action.type) {
    case 'add':
      return oldPremises.concat(['']);
    case 'delete':
      return oldPremises.slice(0, action.index).concat(oldPremises.slice(action.index + 1));
    case 'update': {
      const copy = oldPremises.slice();
      copy[action.index] = action.update;
      return copy;
    }
    default:
      throw new Error(`unrecognized premise action: ${JSON.stringify(action)}`);
  }
}

export default function ImprovingArgument(props) {
  const {
    initialPremises,
    initialConclusion,
    onCancel,
    onSave,
  } = props;

  // Arguments require at least 2 premises.
  // If we're given fewer, pad the array so the UI gets empty boxes.
  const paddedPremises = initialPremises
    .concat(Array(2).fill(''))
    .slice(0, Math.max(initialPremises.length, 2));
  const [premises, changePremise] = useReducer(updatePremises, paddedPremises);
  const [conclusion, setConclusion] = useState(initialConclusion);

  // const deleteNode = onDelete
  //   ? (<button className="delete control" type="button" onClick={onDelete}>Delete</button>)
  //   : null;

  const cancelNode = onCancel
    ? (<button className="cancel control" type="button" onClick={onCancel}>Cancel</button>)
    : null;

  const hasEdits = initialPremises.length !== premises.length
    || initialConclusion !== conclusion
    || initialPremises.find((oldPremise, index) => oldPremise !== premises[index]) !== undefined;

  return (
    <div className="argument-area">
      <h1 className="suppose">The belief that</h1>
      <div className="conclusion-area">
        <input value={conclusion} onChange={(ev) => setConclusion(ev.target.value)} className="conclusion editing" />
      </div>
      <h1 className="then">Is reasonable if</h1>
      <ul className="premises">
        {renderPremises(initialPremises, premises, changePremise)}
        <div tabIndex="0" className="new control" onClick={() => changePremise({ type: 'add' })}>new</div>
      </ul>
      <div className="control-panel">
        <button
          className="save control"
          disabled={!hasEdits}
          type="button"
          onClick={onSave.bind(null, { premises, conclusion })}
        >
          Save
        </button>
        {cancelNode}
        {/* {deleteNode} */}
      </div>
    </div>
  );
}

function renderPremises(initialPremises, premises, changePremise) {
  const nodes = premises.map((premise, index) => (
    <input
      type="text"
      value={premise}
      onChange={(ev) => changePremise({ type: 'update', index, update: ev.target.value })}
      key={`${index}-text`}
      className="premise"
    />
  ));
  const revertButtons = premises.map((premise, index) => {
    if (premises.length > 2) {
      return (<div key={`${index}-revert`} tabIndex="0" className="delete control" onClick={() => changePremise({ type: 'delete', index })}>d</div>);
    }
    return null;
  });

  return revertButtons.map((revertNode, index) => [revertNode, nodes[index]])
    .reduce((prev, current) => (current === null ? prev : prev.concat(current)), []);
}
