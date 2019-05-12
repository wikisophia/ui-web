/**
 * The HTML output by this component must be kept in sync with
 * <project-root>/server/src/views/argument.handlebars
 * 
 * If the user disables javascript, they'll see that static HTML.
 * If javascript is available, this Component will replace it and
 * add edit controls.
 * 
 * Keeping the two in sync will make sure users with javascript don't
 * see the screen "flicker" on load.
 */

function renderPremise(premise) {
  return (
    <li className="premise">
      <div tabindex="0" className="search">s</div>
      <p className="premise">{premise}</p>
    </li>
  )
}

export default class Argument extends React.Component {
  render() {
    return (
      <div className="argument-area">
        <h1 className="suppose">Suppose...</h1>
        <div className="premises">
          <ul className="premises">
            {this.props.premises.map(renderPremise)}
          </ul>
        </div>
        <h1 className="then">Then</h1>
        <div className="conclusion">
          <div className="conclusion-table">
            <div className="conclusion-row">
              <div tabindex="0" className="new">n</div>
              <p className="conclusion">{this.props.conclusion}</p>
            </div>
          </div>
        </div>
        <button className="previous" type="button">Previous</button>
        <button className="edit" type="button">Edit</button>
        <button className="next" type="button">Next</button>
      </div >
    )
  }
}
