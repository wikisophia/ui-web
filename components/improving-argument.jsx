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
  const [premises, changePremise] = useReducer(updatePremises, initialPremises);
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
      <style jsx>{`
      .premises, .conclusion-area, .outdated {
        background-color: #e1e1e6;
        border: 1px solid #bcbcbc;
        color: #322222;
        border-radius: 7px;
        padding: 2rem;
        margin-top: 0;
        margin-bottom: 2rem;
      }

      .premises, .conclusion-area {
        display: grid;
        grid-template-columns: minmax(3rem, max-content) auto;
        grid-template-rows: auto;
        grid-gap: 2rem 0.5rem;
      }

      .premises > :global(.control), .conclusion-area .control {
        grid-column-start: 1;
        grid-column-end: 2;
        align-self: center;
        width: 3rem;
        border: none;
        color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      .control-panel .control {
        margin-right: 1rem;
      }

      .premises > :global(.control:hover), .conclusion-area .control:hover {
        cursor: pointer;
      }

      .premises > :global(.control:active), .conclusion-area .control:active {
        border: none;
      }

      .premises > :global(.premise), .conclusion-area .conclusion {
        grid-column-start: 2;
        grid-column-end: 3;
        align-self: center;
      }

      .conclusion-area .conclusion.editing {
        grid-column-start: 1;
        grid-column-end: 3;
      }

      .premise:first-child {
        padding-top: 0;
      }

      .premise:last-child {
        padding-bottom: 0;
      }

      .suppose, .then {
        margin: 0;
      }

      .edit, .save {
        color: #fff;
        background-color: #4056f4;
      }

      .cancel {
        color: #fff;
        background-color: #63372c;
      }

      .control-panel .delete {
        color: #fff;
        background-color: #ff4242;
      }

      .new {
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFZSURBVEhL7dVPKwZRFMfxYYHy5wWQN2BDLFlhhZ09xUoRr8Gb8Cf2isKendhYYSdKkbD3J8L3V3Pr9HRm5t4eNvKrz+aZe+7pmblzJvvPb6cb89jBMS5wiBVMoBl1pRObeMdXiVvMoBHJGcIDvI2L7KEN0RnEK7zNqhyhCZXpwiO8Td5wlbvLf/OsozIb8IrlDCG6td4a+cQACqPT9QGvWGIbyS4KswCvKEhp9IzCg7ENu1jP5NTYQkgf7LVL2FoZhpsT2IU3iM04bK1Mw8057MJ6G2mauDmAXXgPnZ6gByG6//baImytTMLNKmoXWymHQXrhRgPSKwhSGpXe9hZoQHqFktJoGaWZhVco1xjNLeW/eTSMO1CaBuzD2yCGJssYoqITpSnsbVRGTeaQFH0116AB6W1a6wnR/8RLP/RBe4HXQKdLD74dP5JWjGAKeuP1Mha+J389WfYNM50JgnpUiA0AAAAASUVORK5CYII=') 50% 50% no-repeat;
      }
      .premises > :global(.delete) {
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFCSURBVFhH7dexK0VhGMfxk0UZlZVsFotBBhuL2Z2E3cTmHzCoa7HYZVAM6rIZ2TCgZDVQhIESC77P9T71pue9nXPPeXXV+6vPcJ7e+76/zqnTPVnB9GELd/gKeMMpphEtXTiBVcDyiQlEyRj0oCfsY+eXXZxB1+0hSuahh8zJoEVuIeuumlclsg09NJZHjCCYccitlmdtbVC1c6zBzAysH8V0ATM1PP+xY/yvrOAwokHkzgGsZ1yVYeROKhOKVaaBSefSze692bqbiSU3C70uSpfZgOYIMrtpXv1kAbpWXqCSfujMl8qkMpJURpLK+FIZSSoTSioTSseXeYB80ItXN/vwZlJM1167mXyK6MxXqIx8I1ubVGUIuVOHtUkV3tGD3BnAC6zNylpF4UxB/uNaG7ZrE91oK72YxXJJixhFi2TZN1JTZTI8VgrgAAAAAElFTkSuQmCC') 50% 50% no-repeat;
      }

      .argument-area .footer {
        user-select: none;
      }

      .argument-area p {
        margin: 0;
      }

      .delete-notice {
        padding-bottom: 2rem;
      }
      `}</style>
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
