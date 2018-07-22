import ArgumentEditor from '../../components/ArgumentEditor';

export class NewArgument extends React.Component {
  // props.apiAuthority: string
  // props.conclusion: string
  // props.premises: string[]
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
  }

  save(argument) {
    const ajax = new XMLHttpRequest();
    ajax.timeout = 1000;
    ajax.addEventListener('readystatechange', () => {
      if (ajax.readyState === 2) {
        if (ajax.status >= 200 && ajax.status < 300) {
          window.location = ajax.getResponseHeader('Location');
        } else if (ajax.status >= 400 && ajax.status < 500) {
          throw new Error(`Could not save argument. Server responded with ${ajax.status}. Please report this bug.`);
        } else {
          throw new Error(`Could not save argument. Server responded with ${ajax.status}. Try again later. If this problem persists, please report it.`);
        }
      }
    });
    ajax.open('POST', `//${this.props.apiAuthority}/arguments`, true);
    ajax.setRequestHeader('Content-Type', 'application/json');
    ajax.send(JSON.stringify(argument));
  }

  render() {
    return (
      <ArgumentEditor
        conclusion={this.props.conclusion}
        premises={this.props.premises}
        onSave={this.save}
      />
    );
  }
}