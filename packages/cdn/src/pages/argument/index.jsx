import ArgumentEditor, {ManageArgumentState} from '../../components/ArgumentEditor';
import newClient from '@wikisophia/api-arguments-client';

class Argument extends React.Component {
  render() {
    const premiseNodes = this.props.premises.map((premise) => {
      const href = `/arguments?conclusion=${encodeURIComponent(premise.text)}`;
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
            Not convincing? <a href={`/new-argument?conclusion=${this.props.conclusion}`}>Contribute your own</a>.
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
    this.client = newClient({
      url: `http://${props.apiAuthority}`,
      fetch: fetch
    });
  }

  onEditStart() {
    this.setState({
      editing: true
    })
  }

  onSave(argument) {
    const component = this;
    let remoteCall;
    if (this.props.argumentId) {
      remoteCall = this.client.update(this.props.argumentId, argument)
    } else {
      remoteCall = this.client.save(argument)
    }
    remoteCall.then(function () {
      component.setState({
        editing: false
      });
    }).catch(function (err) {
      component.setState({
        error: err.message
      });
    });
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

export { default as Argument } from '../../components/Argument';