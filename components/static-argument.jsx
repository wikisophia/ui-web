import React from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';

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
    supported: PropTypes.bool.isRequired,
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
      {onEdit
        ? (
          <div className="control-panel">
            <button className="edit" onClick={() => onEdit()} type="button">Improve it!</button>
          </div>
        )
        : null}
      <style jsx>
        {`
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

      .control-panel .control {
        margin-right: 1rem;
      }

      .premises > :global(.premise), .conclusion-area .conclusion {
        grid-column-start: 2;
        grid-column-end: 3;
        align-self: center;
      }

      .conclusion-area .conclusion {
        grid-column-start: 1;
        grid-column-end: 3;
      }

      .premise:first-child {
        padding-top: 0;
      }

      .premise:last-child {
        padding-bottom: 0;
      }

      .premises > :global(.premise.unjustified) {
        color: #ff1a1a;
      }

      .suppose, .then {
        margin: 0;
      }

      .edit {
        color: #fff;
        background-color: #4056f4;
      }

      .argument-area .footer {
        user-select: none;
      }

      .argument-area p {
        margin: 0;
      }
      `}
      </style>
    </div>
  );
}

function renderPremise(premise) {
  if (premise.supported) {
    return (
      <Link key={premise.text} href={`/arguments?conclusion=${encodeURIComponent(premise.text)}`}>
        <a className="premise justified">{premise.text}</a>
      </Link>
    );
  }

  return (
    <Link key={premise.text} href={`/new-argument?conclusion=${encodeURIComponent(premise.text)}`}>
      <a className="premise unjustified">{premise.text}</a>
    </Link>
  );
}
