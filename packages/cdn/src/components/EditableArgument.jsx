import newClient from '@wikisophia/api-arguments-client';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { EditingArgument } from './EditingArgument';
import { StaticArgument } from './StaticArgument';

/**
 * The EditableArgument renders the main content section of the
 * /arguments and /new-argument pages.
 *
 * This operates like a mini single-page application.
 *
 * At minimum, the component must be initialized with text for a conclusion and a few premises.
 * Optionally, it can also be populated with related data, like:
 *
 *   Is there a supporting argument for each premise? What is it?
 *   Are there other arguments for this conclusion?
 *
 * For a full list, see the PropTypes.
 *
 * You'll get the best performance if you pass in all optional properties up front.
 * After mounting, it will fetch any missing pieces from the API asynchronously.
 *
 * Since arguments are relatively small, it will pre-fetch any data it needs to serve
 * content for the "next click" to make the UX as snappy as possible.
 */
EditableArgument.propTypes = {
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

    // The argument's version. Can be undefined if it hasn't been saved yet.
    version: PropTypes.number,

    // This argument's premises
    premises: PropTypes.arrayOf(PropTypes.string).isRequired,

    // The argument's conclusion
    conclusion: PropTypes.string.isRequired,

    // True if this argument is soft-deleted (won't show up in searches anymore),
    // and false otherwise.
    deleted: PropTypes.bool.isRequired,
  }).isRequired
};

export function EditableArgument(props) {
  const [deleted, setDeleted] = useState(props.initialArgument.deleted ? true : false);
  const [argument, setArgument] = useState(argumentPropToState(props.initialArgument));
  const [editing, setEditing] = useState(props.initialEditing);
  const [error, setError] = useState(null);

  // This component takes control of the browser history so that the back and forward buttons
  // keep working as it changes the content with AJAX calls.
  //
  // This effect sets that up by saving the initial state and attaching the listeners
  // that restore it on "back".
  useEffect(() => {
    history.replaceState({ deleted, argument, editing, error }, 'Wikisophia', window.location);
    function listener(event) {
      setDeleted(event.state.deleted);
      setArgument(event.state.argument);
      setEditing(event.state.editing);
      setError(event.state.error);
    }
    window.addEventListener('popstate', listener);
    return window.removeEventListener.bind(window, 'popstate', listener);
  }, []);

  const api = newClient({
    url: `http://${props.apiAuthority}`,
    fetch: fetch,
  });

  if (deleted) {
    return (
      <div>
        <div className="delete-notice">The argument has been deleted. It can be restored by clicking the button below.</div>
        <button type="button" onClick={restorer(setDeleted)}>Restore it</button>
      </div>
    )
  } else if (editing) {
    return (
      <EditingArgument { ...editingArgumentProps(api, argument, setArgument, setEditing, setError, setDeleted) } />
    );
  } else {
    return (
      <StaticArgument {...staticArgumentProps(argument, setArgument, setEditing, setError, setDeleted)} />
    );
  }
}

function editingArgumentProps(api, argumentState, setArgument, setEditing, setError, setDeleted) {
  return {
    initialArgument: {
      premises: argumentState.premises.map(premise => premise.conclusion),
      conclusion: argumentState.conclusion
    },
    onSave: saver(api, argumentState, setArgument, setEditing, setError),
    onCancel: argumentState.id ? canceller(setEditing) : null,
    onDelete: argumentState.id ? deleter(setDeleted) : null,
  };
}

/**
 *
 * @param {ArgumentState} argumentState
 * @param {*} setEditing
 */
function staticArgumentProps(argumentState, setArgument, setEditing, setError, setDeleted) {
  function newArgumentNavigator(conclusion) {
    return function() {
      const newArgumentState = {
        premises: [{conclusion: ''}, {conclusion: ''}],
        conclusion,
      };
      setArgument(newArgumentState);
      setEditing(true);
      setDeleted(false);
      setError(null);
      history.pushState({
        deleted: false,
        argument: newArgumentState,
        editing: true,
        error: null,
      }, 'Wikisophia', `/new-argument?conclusion=${encodeURIComponent(conclusion)}`);
    };
  }

  return {
    premises: argumentState.premises.map(function(premise) {
      let support;
      if (premise.hasSupport === true) {
        support = {
          exists: true,
          onClick: function() {
            // TODO: implement navigation to the related argument
          },
        };
      } else if (premise.hasSupport === false) {
        support = {
          exists: false,
          onClick: newArgumentNavigator(premise.conclusion),
        };
      }

      return {
        text: premise.conclusion,
        support,
      };
    }),

    conclusion: argumentState.conclusion,
    onNew: newArgumentNavigator(argumentState.conclusion),
    onNext: function () {
      // TODO: What happens when the user loads the next argument
    },
    onEdit: startEditor(setEditing),
  };
}

/**
 *
 * @param {*} argument
 * @return {ArgumentState}
 */
function argumentPropToState(argument) {
  const premises = argument.premises.map(premise => ({
    conclusion: premise,
  }));
  while (premises.length < 2) {
    premises.push({ conclusion: '' });
  }
  return Object.assign({}, argument, { premises });
}

function stateSetter(setter, value) {
  return function() {
    setter(value)
  }
}

/**
 * Make a handler which deletes the argument.
 *
 * @param {function(boolean)} setDeleted
 */
function deleter(setDeleted) {
  return function() {
    // TODO: Do Delete once the JS client supports it.
    setDeleted(true);
  }}

/**
 * Make a handler which restore sthe deleted argument.
 *
 * @param {function(boolean)} setDeleted
 */
function restorer(setDeleted) {
  return function() {
    setDeleted(false);
  }
}

function canceller(setEditing) {
  return function() {
    setEditing(false)
  }
}

function startEditor(setEditing) {
  return function() {
    setEditing(true)
  }
}

/**
 * Make a handler which saves the argument.
 */
function saver(api, oldArgumentState, setArgument, setEditing, setError) {
  return function(newArgumentData) {
    if (hasEdits(oldArgumentState, newArgumentData)) {
      const call = oldArgumentState.id
        ? api.update(oldArgumentState.id, newArgumentData)
        : api.save(newArgumentData);

      call.then(saveHttpResponseHandler(oldArgumentState, setEditing, setArgument))
          .catch(setError);
    } else {
      setEditing(false);
    }
  }
}

function hasEdits(oldArgument, newArgument) {
  if (oldArgument.conclusion !== newArgument.conclusion) {
    return true;
  }
  if (oldArgument.premises.length !== newArgument.premises.length) {
    return true;
  }
  for (let i = 0; i < oldArgument.premises.length; i++) {
    if (oldArgument.premises[i].conclusion !== newArgument.premises[i]) {
      return true;
    }
  }
  return false;
}

function saveHttpResponseHandler(oldArgument, setEditing, setArgument) {
  return function(response) {
    setEditing(false);
    const newArgument = {
      id: response.argument.id,
      premises: response.argument.premises.map(premise => ({
        conclusion: premise,
      })),
      conclusion: response.argument.conclusion,
    };
    setArgument(newArgument);
    history.pushState({
      argument: newArgument,
      deleted: false,
      editing: false,
      error: null,
    }, 'Wikisophia', response.location);
  };
}

/**
 * @typedef ArgumentProp
 *
 * @property [int] id
 * @property [int] version
 * @property {string[]} premises
 * @property {string} conclusion
 * @property {boolean} deleted
 */

/**
 * @typedef ArgumentState
 *
 * @property [int] id
 * @property [int] version
 * @property {{conclusion: string}[]} premises
 * @property {string} conclusion
 * @property {boolean} deleted
 */

/**
 * @typedef PremiseState
 *
 * @property {string} conclusion This text of the premise of the argument being viewed.
 *   This is named a bit weirdly because the Component will fetch an argument which
 *   supports this premise in the background. This name comes from the fact that the premise
 *   of this argument is the conclusion of the argument which supports it.
 *
 * @property [boolean] hasSupport True if this premise has a supporting argument, false if not,
 *   and undefined if we're not sure yet.
 * @property [int] id The ID of the supporting argument.
 *   This will be defined iff hasSupport is true.
 * @property [int] version The version of the supporting argument.
 *   This will be defined iff hasSupport is true.
 * @property [Array<string>] premises The premises in teh supporting argument.
 *   This will be true iff hasSupport is true.
 */
