import React from 'react';
import PropTypes from 'prop-types';

/**
 * An EditingArgument shows an argument in the process of being edited.
 *
 * For the "static" view, see StaticArgument.jsx.
 */
export class EditingArgument extends React.Component {
  render() {
    const undoConclusion = this.props.onRevertConclusion
      ? (<div tabIndex="0" className="undo control conclusion" onClick={this.props.onRevertConclusion}>undo</div>)
      : (<div className="spacer control conclusion">s</div>);

    const deleteNode = this.props.onDelete
      ? (<button className="delete control footer" type="button" onClick={this.props.onDelete}>delete</button>)
      : null;

    const cancelNode = this.props.onCancel
      ? (<button className="cancel control footer" type="button" onClick={this.props.onCancel}>cancel</button>)
      : null;

    return (
      <div className="argument-area">
        <h1 className="suppose">If you agree that</h1>
        <ul className="premises">
          {this.renderPremises()}
          <div tabIndex="0" className="new control premise" onClick={this.props.onNewPremise}>new</div>
        </ul>
        <h1 className="then">Then you should believe that</h1>
        {undoConclusion}
        <input value={this.props.conclusion} onChange={extractValueThen(this.props.onChangeConclusion)} className="conclusion" />
        <button className="save control footer" type="button" onClick={this.props.onSave}>save</button>
        {cancelNode}
        {deleteNode}
      </div>
    )
  }

  renderPremises() {
    const premises = this.props.premises;
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
}

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
}

// transform a "string" callback into an "event payload" one.
// converts our component's onChange handlers into <input> tag ones.
function extractValueThen(handle) {
  return function (ev) {
    handle(ev.target.value);
  }
}