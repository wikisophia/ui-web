import ArgumentEditor, {ManageArgumentState} from '../../components/ArgumentEditor';

class ViewArgument extends React.Component {
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

    this.startEditing = this.startEditing.bind(this);
  }

  startEditing() {
    this.setState({
      editing: true,
    });
  }

  render() {
    if (this.state.editing) {
      return (
        <ArgumentEditor {...this.props} />
      );
    }
    else {
      const premiseNodes = this.props.premises.map((premise) => {
        const href = `/argument?conclusion=${encodeURIComponent(premise)}`;
        return <li className="premise" key={premise.id}>
          <a className="premise-text" href={href}>{premise.text}</a>
        </li>;
      });
      return (
        <div>
          <button type="button" onClick={this.startEditing}>Edit this argument</button>
          <section className="conclusion">
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

export const EditableArgument = ManageArgumentState(
  ViewArgument,
  (component, argument) => {
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
)

