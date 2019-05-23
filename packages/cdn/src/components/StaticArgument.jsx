/**
 * A StaticArgument renders the premises and conclusion as static text.
 *
 * For the "being edited" view, see EditableArgument.jsx.
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

export class StaticArgument extends React.Component {
  render() {
    const next = this.props.onNext
      ? <div tabIndex="0" className="search control conclusion" onClick={this.props.onNext}>s</div>
      : null;

    return (
      <div className="argument-area">
        <h1 className="suppose">If you agree that</h1>
        <ul className="premises">
          {this.renderPremises()}
          {/* This dummy node adds space where the "add new premise" button appears in edit mode. */}
          <div key={'add-new-premise-spacer'} tabIndex="0" className="control spacer">s</div>
        </ul>
        <h1 className="then">Then you should believe that</h1>
        {next}
        <p className="conclusion">{this.props.conclusion}</p>
        <button className="new control footer" type="button" onClick={this.props.onNew}>edit</button>
        <button className="edit control footer" type="button" onClick={this.props.onEdit}>edit</button>
      </div >
    )
  }

  renderPremises() {
    const premises = this.props.premises;
    const searches = premises.map((premise, index) => {
      if (premise.hasSupport === true) {
        return (<div key={index + '-search'} tabIndex="0" className="search control" onClick={premise.onClick}>s</div>);
      } else if (premise.hasSupport === false) {
        return (<div key={index + '-new'} tabIndex="0" className="new control" onClick={premise.onClick}>n</div>);
      } else {
        return <div key={index + '-spacer'} tabIndex="0" className="control spacer">s</div>
      }
    });
    const nodes = premises.map((premise, index) => (
      <p key={index + '-text'} className="premise">{premise.text}</p>
    ));
    return searches.map((searchNode, index) => {
      return [searchNode, nodes[index]];
    }).reduce((prev, current) => prev.concat(current), []);
  }
}

StaticArgument.propTypes = {
  // premises make an argument for the conclusion
  premises: PropTypes.arrayOf(PropTypes.shape({
    // text is the actual text of the premise
    text: PropTypes.string.isRequired,

    // hasSupport should be true if there exists at least one argument which
    // supports this premise, false if not, and undefined if you're not sure.
    hasSupport: PropTypes.bool,

    // onClick will be called if the user clicks on the "search" or "new" icon
    // next to this premise.
    onClick: PropTypes.func.isRequired,
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
}