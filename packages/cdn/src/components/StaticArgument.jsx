import newClient from '@wikisophia/api-arguments-client';
import React, { useEffect, useState, useReducer } from 'react';
import PropTypes from 'prop-types';

export const YES = 'yes';
export const NO = 'no';

/**
 * A StaticArgument renders the argument as plain text.
 *
 * For an argument which is being edited, see ./ImprovingArgument.jsx.
 *
 */
StaticArgument.propTypes = {
  // premises make an argument for the conclusion.
  premises: PropTypes.arrayOf(PropTypes.exact({
    // the premise in plain text.
    text: PropTypes.string.isRequired,

    // does at least one argument exist which supports this premise?
    supported: PropTypes.oneOf([YES, NO]).isRequired,
  })).isRequired,

  // the argument's conclusion
  conclusion: PropTypes.string.isRequired,

  // Function called if the user starts to edit the argument.
  onEdit: PropTypes.func,
};

StaticArgument.defaultProps = {
  onEdit: null,
};

export default function StaticArgument(props) {
  const { premises, conclusion, onEdit } = props;

  return (
    <div className="argument-area">
      <h1 className="then">The belief that</h1>
      <div className="conclusion-area">
        <p className="conclusion">{conclusion}</p>
      </div>
      <h1 className="suppose">Is reasonable if</h1>
      <ul className="premises">
        {premises.map(renderPremise)}
      </ul>
      <div className="control-panel">
        <button className="edit" onClick={() => onEdit()} type="button">Improve</button>
      </div>
    </div>
  );
}

function renderPremise(premise, index) {
  switch (premise.supported) {
    case YES:
      return <a href={`/arguments?conclusion=${encodeURIComponent(premise.text)}`}
        key={premise.text}
        className="premise justified"
      >
        {premise.text}
      </a>;
    case NO:
      return <a href={`/new-argument?conclusion=${encodeURIComponent(premise.text)}`}
        key={premise.text}
        className="premise unjustified"
      >
        {premise.text}
      </a>;
    default:
      throw new Error('Unexpected premise.supported value: ' + premise.supported);
  }
}
