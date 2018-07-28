import ArgumentEditor, { ManageArgumentState } from '../../components/ArgumentEditor';
import save from '../../api/save-argument';

const StateManagedArgument = ManageArgumentState(ArgumentEditor)

// props.apiAuthority: string
// props.conclusion: string
// props.premises: string[]
export class NewArgument extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: ""
    }

    this.onSave = this.onSave.bind(this)
  }

  onSave(argument) {
    const component = this;
    save(this.props.apiAuthority, argument, function(url, err) {
      if (err) {
        component.setState({
          error: err.message
        });
      } else {
        window.location = url;
      }
    });
  }

  render() {
    return <StateManagedArgument
      error={this.state.error}
      onSave={this.onSave}
      premises={this.props.premises}
      conclusion={this.props.conclusion}
    />
  }
}