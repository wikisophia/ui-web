import { ArgumentEditor } from './ArgumentEditor';
import { StaticArgument } from '../components/StaticArgument';

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

    this.state = {
      editing: false,
      deleted: false,
      argument: {
        premises: props.initialArgument.premises.map(premise => ({
          hasSupport: premise.hasSupport,
          conclusion: premise.text
        })),
        conclusion: props.initialArgument.conclusion,
        hasNext: props.initialArgument.hasNext,
      }
    }
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
    const component = this;

    return {
      initialArgument: {
        premises: this.state.argument.premises.map(premise => premise.conclusion),
        conclusion: this.state.argument.conclusion
      },
      onSave: function() {

      },
      onCancel: this.onCancel.bind(this),
      onDelete: this.onDelete.bind(this),
    };
  }

  onCancel() {
    this.setState({
      editing: false,
      argument: {
        premises: this.props.initialArgument.premises.map(premise => ({
          hasSupport: premise.hasSupport,
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
  initialArgument: PropTypes.shape({
    premises: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      // hasSupport should be true iff at least one argument exists
      // which supports this premise.
      hasSupport: PropTypes.bool.isRequired,
    })).isRequired,

    // The argument's conclusion
    conclusion: PropTypes.string.isRequired,
    
    // True if there's another argument for this conclusion, and false otherwise.
    hasNext: PropTypes.bool.isRequired,
  })
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