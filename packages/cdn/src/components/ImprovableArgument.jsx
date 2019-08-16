/* eslint react/prop-types: 0 */
// False positives from https://github.com/yannickcr/eslint-plugin-react/issues/2350 ... I think

import React from 'react';
import PropTypes from 'prop-types';
import { useRoutes, navigate } from 'hookrouter';
import StaticArgument, { YES, NO } from './StaticArgument';
import ImprovingArgument from './ImprovingArgument';

// These routes handle argument editing to make the UX snappy (like a single-page app).
// Their only goal is to make sure the "/improve" link goes quickly.
const routes = {
  '/arguments/:id/improve': ({ id }) => ({ premises, conclusion, onSave }) => (
    <ImprovingArgument
      initialPremises={premises.map((premise) => premise.text)}
      initialConclusion={conclusion}
      onCancel={() => navigate(`/arguments/${id}`)}
      onSave={onSave}
    />
  ),

  '/arguments/:id': ({ id }) => ({ premises, conclusion }) => (
    <StaticArgument
      premises={premises}
      conclusion={conclusion}
      onEdit={() => navigate(`/arguments/${id}/improve`)}
    />
  ),
};

ImprovableArgument.propTypes = {
  // the argument's premises
  premises: PropTypes.arrayOf(PropTypes.exact({
    // the premise in plain text
    text: PropTypes.string.isRequired,

    // does at least one argument exist which supports this premise?
    supported: PropTypes.oneOf([YES, NO]).isRequired,
  })).isRequired,

  // the argument's conclusion
  conclusion: PropTypes.string.isRequired,

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

export default function ImprovableArgument(props) {
  return useRoutes(routes)(props) || <span>404 Page Not Found</span>;
}
