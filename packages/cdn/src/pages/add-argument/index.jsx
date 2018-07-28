import ArgumentEditor, { ManageArgumentState } from '../../components/ArgumentEditor';
import save from '../../api/save-argument';

const StateManagedArgument = ManageArgumentState(ArgumentEditor)

// props.apiAuthority: string
// props.conclusion: string
// props.premises: string[]
export class NewArgument extends React.Component {
  constructor(props) {
    super(props)

    this.onSave = this.onSave.bind(this)
  }

  onSave(argument) {
    save(this.props.apiAuthority, argument, function(url, err) {
      if (err) {
        throw err;
      }
      window.location = url;
    });
  }

  render() {
    return <StateManagedArgument onSave={this.onSave} {...this.props} />
  }
}