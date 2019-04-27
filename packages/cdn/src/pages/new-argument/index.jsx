import ArgumentEditor, { ManageArgumentState } from '../../components/ArgumentEditor';
import newClient from '@wikisophia/api-arguments-client';

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
    this.client = newClient({
      url: `http://${props.apiAuthority}`,
      fetch: fetch
    });
  }

  onSave(argument) {
    const component = this;
    this.client.save(argument).then(function(response) {
      window.location = response.location;
    }).catch(function(err) {
      component.setState({
        error: err.message
      });
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