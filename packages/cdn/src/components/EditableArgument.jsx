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
const propTypeArgument = PropTypes.exact({
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
  // and false otherwise. Undefined is equivalent to false.
  deleted: PropTypes.bool,
});

EditableArgument.propTypes = {
  // api an object which makes calls to the Arguments API.
  // See https://github.com/wikisophia/api-arguments/tree/master/client-js
  api: PropTypes.shape({
    getSome: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
  }).isRequired,

  // The base URL from which the page can load static assets.
  // For example, http://127.0.0.1:4041
  resourcesRoot: PropTypes.string.isRequired,

  // This is the argument the user will see initially.
  initialArgument: propTypeArgument.isRequired,

  // initialArgumentsForPremises seeds the component with arguments which support each premise.
  //
  // This _must_ be the same length as initialArgument.premises.
  // If you have an argument which supports each premise, include it at the same index.
  // If not, send null.
  //
  // Any null values will be populated by an API call post-render.
  initialArgumentsForPremises: PropTypes.arrayOf(
    PropTypes.oneOfType([propTypeArgument, PropTypes.bool]),
  ).isRequired,

  // True if this component should start out in edit mode,
  // or false if it's just showing the static argument.
  initialEditing: PropTypes.bool.isRequired,

  // initialNextForConclusion seeds the component with another argument for the same conclusion.
  //
  // If you know for sure that no other supporing arguments exist, pass false.
  // If you don't know, don't pass it.
  //
  // This is a performance optimization.
  // If defined, thisavoids an API call and renders faster.
  initialNextForConclusion: PropTypes.oneOfType([propTypeArgument, PropTypes.bool]),

  // initialSeenSoFar is an object with int keys.
  //
  // If defined, this component will not return arguments with these IDs as the user
  // asks for other arguments which support this conclusion.
  // eslint-disable-next-line react/forbid-prop-types
  initialSeenSoFar: PropTypes.object,

  // navigate will be called whenever the user does something that changes the argument or
  // starts/stops editing.
  // It will be given passed object like { newArgument, newEditing }, where newEditing is a bool
  // and newArgument matches the propTypeArgument defined in this file.
  //
  // This lets callers make a poor-man's single-page application.
  navigate: PropTypes.func.isRequired,
};

export function EditableArgument(props) {
  const {
    api,
    resourcesRoot,
    initialArgument,
    initialEditing,
    initialSeenSoFar,
    initialNextForConclusion,
    initialArgumentsForPremises,
    navigate,
  } = props;

  const [argument, setArgument] = useState(initialArgument);
  const [editing, setEditing] = useState(initialEditing);
  const [error, setError] = useState(null);

  const [seenSoFar, setSeenSoFar] = useState(initialSeenSoFar);
  const [nextForConclusion, setNextForConclusion] = useState(initialNextForConclusion);
  const [argumentsForPremises, setArgumentsForPremises] = useState(initialArgumentsForPremises);

  function setStateThenNavigate(args) {
    const { newArgument, newEditing, seenSoFar: seenSoFarArgs } = args;
    setArgument(newArgument);
    setArgumentsForPremises(newArgument.premises.map(() => null));
    setEditing(newEditing);
    setNextForConclusion(null);
    setSeenSoFar(newArgument.id
      ? Object.assign({}, seenSoFarArgs, { [newArgument.id]: true })
      : seenSoFarArgs);
    navigate(args);
  }

  // These effects fetch other arguments which support these premises or conclusion.
  // This controls which nav elements render, but also stores them in memory so we
  // can load them immediately.
  useEffect(nextForConclusionFetcher(
    api,
    argument.conclusion,
    seenSoFar,
    nextForConclusion,
    setNextForConclusion,
    editing,
  ));
  useEffect(searchPremiseFetcher(
    api,
    argument.premises,
    argumentsForPremises,
    setArgumentsForPremises,
    editing,
  ));

  if (error) {
    return (
      <div>
        ERROR:
        {' '}
        {JSON.stringify(error)}
      </div>
    );
  }
  if (editing) {
    return (
      <EditingArgument {...editingArgumentProps(
        api,
        argument,
        seenSoFar,
        setError,
        setStateThenNavigate,
      )}
      />
    );
  }

  return (
    <StaticArgument {...staticArgumentProps(
      resourcesRoot,
      argument,
      argumentsForPremises,
      seenSoFar,
      nextForConclusion,
      setStateThenNavigate,
    )}
    />
  );
}

EditableArgument.defaultProps = {
  initialNextForConclusion: null,
  initialSeenSoFar: {},
};

function nextForConclusionFetcher(api, conclusion, seenSoFar, next, setNext, editing) {
  return function fetchNext() {
    if (editing || next !== undefined) {
      return;
    }

    // render() gets called a lot... so if we don't set this immediately,
    // the page makes lots of API calls.
    setNext({});
    api.getSome({
      conclusion,
      count: 1,
      exclude: Object.keys(seenSoFar),
    }).then((results) => {
      if (results.arguments.length > 0) {
        setNext(results.arguments[0]);
      }
    }).catch(() => {
      // TODO: Log this somewhere the server can see it?
    });
  };
}

function searchPremiseFetcher(
  api,
  premises,
  argumentsForPremises,
  setArgumentsForPremises,
  editing,
) {
  return function fetchPremiseSupport() {
    if (editing) {
      return;
    }
    premises.forEach((premise, index) => {
      if (argumentsForPremises[index] !== null) {
        return;
      }
      // Set this immediately so we only make one API call.
      setArgumentsForPremises((oldArguments) => {
        const copy = oldArguments.slice();
        copy[index] = {};
        return copy;
      });

      api.getSome({ conclusion: premise, count: 1 })
        .then((results) => {
          const { arguments: args } = results;
          if (args.length > 0) {
            setArgumentsForPremises((oldArguments) => {
              const copy = oldArguments.slice();
              const [arg] = args;
              copy[index] = arg;
              return copy;
            });
          }
        }).catch(() => {
          // TODO: Log this somewhere the server can see it?
        });
    });
  };
}

function editingArgumentProps(api, argument, seenSoFar, setError, navigate) {
  return {
    initialArgument: argument,
    onSave: saver(api, argument, seenSoFar, setError, navigate),
    onCancel: argument.id ? navigate.bind(null, {
      newArgument: argument,
      newEditing: false,
      seenSoFar,
    }) : null,
    onDelete: argument.id ? function noOp() { } : null, // TODO: Implement deletions
  };
}

function staticArgumentProps(
  resourcesRoot,
  argument,
  argumentsForPremises,
  seenSoFar,
  nextForConclusion,
  navigate,
) {
  function newArgumentNavigator(conclusion) {
    return function navigateToNewArgument() {
      navigate({
        newArgument: { premises: ['', ''], conclusion },
        newEditing: true,
        seenSoFar,
      });
    };
  }

  return {
    premises: argument.premises.map((premise, index) => {
      let support;
      if (argumentsForPremises
        && argumentsForPremises[index] !== undefined
        && argumentsForPremises[index] !== null) {
        if (argumentsForPremises[index].conclusion) {
          return {
            text: premise,
            support: {
              exists: true,
              onClick() {
                navigate({
                  newArgument: argumentsForPremises[index],
                  newEditing: false,
                  seenSoFar,
                });
              },
            },
          };
        }
        return {
          text: premise,
          support: {
            exists: false,
            onClick: newArgumentNavigator(premise),
          },
        };
      }
      return {
        text: premise,
        support,
      };
    }),

    resourcesRoot,
    conclusion: argument.conclusion,
    onNew: newArgumentNavigator(argument.conclusion),
    onNext: nextForConclusion && nextForConclusion.conclusion ? function navigateToNextArgument() {
      navigate({
        newArgument: nextForConclusion,
        newEditing: false,
        seenSoFar,
      });
    } : null,
    onEdit: navigate.bind(null, {
      newArgument: argument,
      newEditing: true,
      seenSoFar,
    }),
  };
}

/**
 * Make a handler which saves the argument.
 */
function saver(api, oldArgument, seenSoFar, setError, navigate) {
  return function save(newArgumentData) {
    if (hasEdits(oldArgument, newArgumentData)) {
      const call = oldArgument.id
        ? api.update(oldArgument.id, newArgumentData)
        : api.save(newArgumentData);

      call.then(response => navigate({
        newArgument: response.argument,
        newEditing: false,
        seenSoFar,
      })).catch(setError);
    } else {
      navigate({
        newArgument: oldArgument,
        newEditing: false,
        seenSoFar,
      });
    }
  };
}

function hasEdits(oldArgument, newArgument) {
  if (oldArgument.conclusion !== newArgument.conclusion) {
    return true;
  }
  if (oldArgument.premises.length !== newArgument.premises.length) {
    return true;
  }
  const changedPremise = oldArgument.premises.find(
    (oldPremise, index) => oldPremise !== newArgument.premises[index],
  );
  return changedPremise !== undefined;
}
