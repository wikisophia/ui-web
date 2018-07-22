import ArgumentEditor, {ManageArgumentState} from '../../components/ArgumentEditor';

export class ViewArgument extends React.Component {
  // props.apiAuthority: string
  // props.argumentId: string
  // props.conclusion: string
  // props.premises: string[]
  // props.afterSave: function(argument)
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };

    this.save = this.save.bind(this);
    this.startEditing = this.startEditing.bind(this);
  }

  save(argument) {
    if (argument.conclusion === this.props.conclusion) {
      const ajax = new XMLHttpRequest();
      ajax.addEventListener('load', (ev) => {
        if (ev.target.status >= 200 && ev.target.status < 300) {
          this.setState({
            editing: false
          });
          this.props.afterSave(argument);
        } else if (ev.target.status >= 400 && ev.target.status < 500) {
          throw new Error(`Could not save argument. Server responded with ${ev.target.status}. Please report this bug.`)
        } else {
          throw new Error(`Could not save argument. Server responded with ${ev.target.status}. Try again later. If this problem persists, please report it.`);
        }
      });
      ajax.open('PATCH', `//${this.props.apiAuthority}/arguments/${this.props.argumentId}`);
      ajax.send(JSON.stringify({
        premises: argument.premises
      }));
    }
    else {
      const ajax = new XMLHttpRequest();
      ajax.addEventListener('load', (ev) => {
        if (ev.target.status >= 200 && ev.target.status < 300) {
          this.setState({
            editing: false
          });
          window.location = ajax.getResponseHeader('Location');
        } else if (ev.target.status >= 400 && ev.target.status < 500) {
          throw new Error(`Could not save argument. Server responded with ${ev.target.status}. Please report this bug.`)
        } else {
          throw new Error(`Could not save argument. Server responded with ${ev.target.status}. Try again later. If this problem persists, please report it.`);
        }
      });
      ajax.open('POST', `//${this.props.apiAuthority}/arguments`);
      ajax.send(JSON.stringify(argument));
    }
  }

  startEditing() {
    this.setState({
      editing: true,
    });
  }

  render() {
    if (this.state.editing) {
      return (
        <ArgumentEditor
          conclusion={this.props.conclusion}
          premises={this.props.premises}
          onSave={this.save}
        />
      );
    }
    else {
      const premiseNodes = this.props.premises.map((premise) => {
        const href = `/argument?conclusion=${encodeURIComponent(premise)}`;
        return <li className="premise" key={premise}>
          <a className="premise-text" href={href}>{premise}</a>
        </li>;
      });
      return (
        <div>
          <button type="button" onClick={this.startEditing}>Edit this argument</button>
          <section className="conclusion">
            <h1>Conclusion</h1>
            <p className="conclusion-text">{this.props.conclusion}</p>
          </section>
          <p>because...</p>
          <section className="premises">
            <h1>Premises</h1>
            <ul id="premise-list">
              {premiseNodes}
            </ul>
          </section>
        </div>
      );
    }
  }
}
