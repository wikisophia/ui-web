import ArgumentEditor, {ManageArgumentState} from '../../components/ArgumentEditor';

class Argument extends React.Component {
  render() {
    const premiseNodes = this.props.premises.map((premise) => {
      const href = `/argument?conclusion=${encodeURIComponent(premise)}`;
      return <li className="premise" key={premise.id}>
        <a className="premise-text" href={href}>{premise.text}</a>
      </li>;
    });

    return (
      <div>
        <section className="conclusion">
          <p className="conclusion-text">{this.props.conclusion}</p>
        </section>
        <p>because...</p>
        <section className="premises">
          <ul id="premise-list">
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
      const ajax = new XMLHttpRequest();
      ajax.addEventListener('load', (ev) => {
        if (ev.target.status >= 200 && ev.target.status < 300) {
          component.setState({
            editing: false
          });
        } else if (ev.target.status >= 400 && ev.target.status < 500) {
          throw new Error(`Could not save argument. Server responded with ${ev.target.status}. Please report this bug.`)
        } else {
          throw new Error(`Could not save argument. Server responded with ${ev.target.status}. Try again later. If this problem persists, please report it.`);
        }
      });
      ajax.open('PATCH', `//${component.props.apiAuthority}/arguments/${component.props.argumentId}`);
      ajax.send(JSON.stringify({
        premises: argument.premises
      }));
    }
    else {
      const ajax = new XMLHttpRequest();
      ajax.addEventListener('load', (ev) => {
        if (ev.target.status >= 200 && ev.target.status < 300) {
          component.setState({
            editing: false
          });
          window.location = ajax.getResponseHeader('Location');
        } else if (ev.target.status >= 400 && ev.target.status < 500) {
          throw new Error(`Could not save argument. Server responded with ${ev.target.status}. Please report this bug.`)
        } else {
          throw new Error(`Could not save argument. Server responded with ${ev.target.status}. Try again later. If this problem persists, please report it.`);
        }
      });
      ajax.open('POST', `//${component.props.apiAuthority}/arguments`);
      ajax.send(JSON.stringify(argument));
    }
  }

  render() {
    return <StateManagedArgument onSave={this.onSave} onEditStart={this.onEditStart} editing={this.state.editing} {...this.props} />
  }
}
