import ArgumentEditor, {ManageArgumentState} from '../../components/ArgumentEditor';
import save from '../../api/save-argument';
import update from '../../api/update-argument';

class Argument extends React.Component {
  render() {
    const premiseNodes = this.props.premises.map((premise) => {
      const href = `/argument?conclusion=${encodeURIComponent(premise.text)}`;
      return <li className="premise" key={premise.id}>
        <a className="premise-text" href={href}>{premise.text}</a>
      </li>;
    });

    // Careful! When updating this component, make sure to keep
    // #view-argument-anchor in server/views/argument.handlebars in sync.
    // This makes sure the site works properly when javascript is disabled.
    return (
      <div>
        <section className="conclusion">
          <p className="conclusion-text">{this.props.conclusion}</p>
        </section>
        <p>because...</p>
        <section className="premises">
          <ul>
            {premiseNodes}
          </ul>
        </section>
      </div>
    )
  }
}

class EditableArgument extends React.Component {
  render() {
    if (this.props.editing) {
      return (
        <ArgumentEditor
          conclusion={this.props.conclusion}
          premises={this.props.premises}
          error={this.props.error}
          onConclusionChange={this.props.onConclusionChange}
          onPremiseAdd={this.props.onPremiseAdd}
          onPremiseDelete={this.props.onPremiseDelete}
          onPremiseChange={this.props.onPremiseChange}
          onSave={this.props.onSave}
        />
      );
    }
    else {
      return (
        <div>
          <button type="button" onClick={this.props.onEditStart}>Edit this argument</button>
          <Argument premises={this.props.premises} conclusion={this.props.conclusion} />
          <p>
            Not convincing? See <a href={`/arguments?conclusion=${this.props.conclusion}`}>all the arguments</a> supporting this conclusion,
            or <a href={`/add-argument?conclusion=${this.props.conclusion}`}>contribute your own</a>.
          </p>
        </div>
      );
    }
  }
}

const StateManagedArgument = ManageArgumentState(EditableArgument)

export class StatefulEditableArgument extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      error: ""
    }

    this.onEditStart = this.onEditStart.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onEditStart() {
    this.setState({
      editing: true
    })
  }

  onSave(argument) {
    const component = this;
    if (argument.conclusion === component.props.conclusion) {
      update(this.props.apiAuthority, this.props.argumentId, argument.premises, function(value, err) {
        if (err) {
          component.setState({
            error: err.message
          });
        } else {
          component.setState({
            editing: false
          });
        }
      });
    }
    else {
      save(this.props.apiAuthority, argument, function(url, err) {
        if (err) {
          component.setState({
            error: err.message
          });
        } else {
          component.setState({
            editing: false
          });
        }
      })
    }
  }

  render() {
    return <StateManagedArgument
      error={this.state.error}
      editing={this.state.editing}
      onSave={this.onSave}
      onEditStart={this.onEditStart}
      premises={this.props.premises}
      conclusion={this.props.conclusion}
    />
  }
}
