import { ArgumentEditor } from './ArgumentEditor';
import { StaticArgument } from '../components/StaticArgument';
import newClient from '@wikisophia/api-arguments-client';

/**
 * The Argument renders the main content section of the /arguments pages.
 *
 * This works like a very simple single-page application. The Argument
 * is seeded with some premises, a conclusion, and information about what
 * related arguments exist. (is a particular premise supported?
 * Are there other arguments for this conclusion?). Since arguments are tiny,
 * it will pre-fetch data for everything the user might click to keep the UX snappy.
 */

export class Argument extends React.Component {
  constructor(props) {
    super(props);

    const premises = props.initialArgument.premises.map(premise => ({
      conclusion: premise,
    }));

    while (premises.length < 2) {
      premises.push({ conclusion: '' });
    }

    this.state = {
      editing: props.initialArgument.id ? false : true,
      deleted: false,
      argument: {
        id: props.initialArgument.id,
        premises: premises,
        conclusion: props.initialArgument.conclusion,
      }
    }
  }

  componentDidMount() {
    this.api = newClient({
      url: `http://${this.props.apiAuthority}`,
      fetch: fetch
    });

    const self = this;
    history.replaceState(this.state, 'Wikisophia', window.location);
    window.addEventListener('popstate', function(event) {
      self.setState(event.state)
    })
  }

  render() {
    if (this.state.deleted) {
      return (
        <div>
          <div className="delete-notice">The argument has been deleted. It can be restored by clicking the button below.</div>
          <button type="button" onClick={this.onRestore.bind(this)}>Restore it</button>
        </div>
      )
    } else if (this.state.editing) {
      return (
        <ArgumentEditor {...this.argumentEditorProps()} />
      );
    } else {
      return (
        <StaticArgument {...this.staticArgumentProps()} />
      );
    }
  }

  argumentEditorProps() {
    return {
      initialArgument: {
        premises: this.state.argument.premises.map(premise => premise.conclusion),
        conclusion: this.state.argument.conclusion
      },
      onSave: this.onSave.bind(this),
      onCancel: this.state.argument.id ? this.onCancel.bind(this) : null,
      onDelete: this.state.argument.id ? this.onDelete.bind(this) : null,
    };
  }

  onSave(argument) {
    const call = this.state.argument.id
      ? this.api.update(this.state.argument.id, argument)
      : this.api.save(argument);

    call.then(this.syncWithSaveResponse.bind(this))
        .catch(this.onError.bind(this));
  }

  onError(err) {
    this.setState({ error: err });
  }

  syncWithSaveResponse(response) {
    const newState = {
      editing: false,
      argument: {
        id: response.argument.id,
        premises: response.argument.premises.map(premise => ({
          conclusion: premise
        })),
        conclusion: response.argument.conclusion,
      }
    };
    const self = this;
    this.setState(newState, () => {
      history.pushState(self.state, 'Wikisophia', response.location);
    })
  }

  onCancel() {
    this.setState({
      editing: false,
      argument: {
        premises: this.props.initialArgument.premises.map(premise => ({
          conclusion: premise.text
        })),
        conclusion: this.props.initialArgument.conclusion,
      }
    })
  }

  onDelete() {
    this.setState({
      deleted: true,
    })
  }

  onRestore() {
    this.setState({
      deleted: false,
    })
  }

  staticArgumentProps() {
    const component = this;
    return {
      premises: this.state.argument.premises.map(premise => ({
        text: premise.conclusion,
        hasSupport: premise.hasSupport,
        onClick: function() {
          // TODO: handle clicks for searches
        }
      })),
      conclusion: this.state.argument.conclusion,
      onNew: function () {
        // TODO: Make a new argument for this conclusion
      },
      onNext: function () {
        // TODO: What happens when the user loads the next argument
      },
      onEdit: function () {
        component.setState({ editing: true });
      },
    }
  }
}

Argument.propTypes = {
  // The authority of the URL where the API is listening.
  // Something like "api.arguments.wikisophia.net" or "localhost:8001".
  apiAuthority: PropTypes.string.isRequired,

  // This is the argument the user will see initially.
  // If undefined, it will start as a blank form in edit mode.
  initialArgument: PropTypes.shape({
    // This argument's ID. Can be undefined if it doesn't exist yet
    // (for example, "I want to make a new argument with conclusion X,
    // but need the user to fill out the premises")
    id: PropTypes.number,

    // This argument's premises
    premises: PropTypes.arrayOf(PropTypes.string).isRequired,

    // The argument's conclusion
    conclusion: PropTypes.string.isRequired,
  }).isRequired
}

/**
 * A fully formed state object for this component looks like:
 *
 * {
 *   "editing": false,
 *   "argument": {
 *     "premises": [
 *       {
 *         "conclusion": "premise 1",
 *         "hasSupport": true,
 *         "premises": [
 *           {
 *             "text": "some thing",
 *             "hasSupport": true
 *           },
 *           {
 *             "text": "other thing",
 *             "hasSupport": false
 *           }
 *         ],
 *         "hasNext": true
 *       },
 *       {
 *         "conclusion": "premise 2",
 *         "hasSupport": false
 *       }
 *     ],
 *     "conclusion": "some string",
 *     "hasNext": true,
 *     "nextPremises": [
 *       {
 *         "conclusion": "other argument premise 1",
 *         "hasSupport": true
 *       },
 *       {
 *         "conclusion": "other argument premise 2",
 *         "hasSupport": false
 *       }
 *     ]
 *   }
 * }
 */