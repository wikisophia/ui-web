import React from 'react';
import PropTypes from 'prop-types';

/**
 * A StaticArgument renders the argument as plain text.
 *
 * For an argument which is being edited, see ./EditableArgument.jsx.
 *
 * The HTML of this component must be kept in sync with
 * <project-root>/server/src/views/argument.handlebars
 *
 * If the user disables javascript, they'll see that static HTML.
 * If javascript is available, this Component will replace it and
 * add interactive controls.
 *
 * Keeping the two in sync will make sure users with javascript don't
 * see the screen "flicker" on load.
 */
StaticArgument.propTypes = {
  // premises make an argument for the conclusion
  premises: PropTypes.arrayOf(PropTypes.shape({
    // text is the actual text of the premise
    text: PropTypes.string.isRequired,

    // support has info about arguments which support this premise.
    // This doesn't need to be defined if that info isn't available.
    support: PropTypes.shape({
      // exists is true iff at least one argument exists which supports this conclusion,
      exists: PropTypes.bool.isRequired,
      // onClick will be called if the user clicks the "search" or "new" icon next to
      // this premise.
      onClick: PropTypes.func.isRequired,
    }),
  })).isRequired,

  // onNew will be called if the user wants to create a new argument for
  // this same conclusion.
  onNew: PropTypes.func.isRequired,

  // The argument's conclusion
  conclusion: PropTypes.string.isRequired,

  // onNext will be called if the user wants to see another argument.
  // If undefined, this component won't give them the option of seeing a next.
  onNext: PropTypes.func,

  // onEdit will be called if the user wants to edit this argument.
  onEdit: PropTypes.func.isRequired,
};

export function StaticArgument(props) {
  const next = props.onNext
    ? <div tabIndex="0" className="search control conclusion" onClick={props.onNext}>s</div>
    : null;

  return (
    <div className="argument-area">
      <h1 className="suppose">If you believe that</h1>
      <ul className="premises">
        {renderPremises(props)}
        {/* This dummy node adds space where the "add new premise" button appears in edit mode. */}
        <div key={'add-new-premise-spacer'} tabIndex="0" className="control spacer">s</div>
      </ul>
      <h1 className="then">Then you should agree that</h1>
      {next}
      <p className="conclusion">{props.conclusion}</p>
      <button className="new control footer" type="button" onClick={props.onNew}>new</button>
      <button className="edit control footer" type="button" onClick={props.onEdit}>edit</button>
    </div >
  )
}

function renderPremises(props) {
  const premises = props.premises;
  const searches = premises.map((premise, index) => {
    if (premise.support) {
      if (premise.support.exists) {
        return (<div key={index + '-search'} tabIndex="0" className="search control" onClick={premise.onClick}>s</div>);
      } else {
        return (<div key={index + '-new'} tabIndex="0" className="new control" onClick={premise.onClick}>n</div>);
      }
    } else {
      return <div key={index + '-spacer'} className="control spacer">s</div>
    }
  });
  const nodes = premises.map((premise, index) => (
    <p key={index + '-text'} className="premise">{premise.text}</p>
  ));
  return searches.map((searchNode, index) => {
    return [searchNode, nodes[index]];
  }).reduce((prev, current) => prev.concat(current), []);
}
