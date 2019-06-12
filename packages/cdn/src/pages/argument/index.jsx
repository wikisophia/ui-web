import newClient from '@wikisophia/api-arguments-client';
import React from 'react';
import ReactDOM from 'react-dom';

import { EditableArgument } from '../../components/EditableArgument';

// This file handles the nasty global stuff to maintain a poor man's single-page-app.
// Putting those globals here keeps the React components testable.

function buildURL({ argument, editing }) {
  if (editing) {
    if (argument.id) {
      return `/arguments/${argument.id}/edit`;
    }
    return '/new-argument';
  }
  if (argument.id) {
    if (argument.version) {
      return `/arguments/${argument.id}/version/${argument.version}`;
    }
    return `/arguments/${argument.id}`;
  }
}

function navigate({ newArgument, newEditing, seenSoFar }) {
  const pageState = {
    argument: newArgument,
    argumentsForPremises: newArgument.premises.map((premise) => null),
    editing: newEditing,
    nextForConclusion: null,
    seenSoFar: newArgument.id ? Object.assign({}, seenSoFar, { [newArgument.id]: true }) : seenSoFar,
  };
  history.pushState(pageState, 'Wikisophia', buildURL(pageState));
}

const initialProps = function() {
  const { apiUrl, ...props } = JSON.parse(document.getElementById('argument-props').innerHTML);
  props.api = newClient({
    url: apiUrl,
    fetch: fetch,
  });
  props.navigate = navigate;
  return props;
}();

function render(props) {
  const anchor = document.getElementById("argument-anchor");
  ReactDOM.unmountComponentAtNode(anchor)
  ReactDOM.render(React.createElement(EditableArgument, props), anchor);
}

window.addEventListener('popstate', function onPopState(event) {
  render({
    api: initialProps.api,
    navigate: initialProps.navigate,
    initialArgument: event.state.argument,
    initialArgumentsForPremises: event.state.argumentsForPremises,
    initialEditing: event.state.editing,
    initialNextForConclusion: event.state.nextForConclusion,
    initialSeenSoFar: event.state.seenSoFar,
  });
});
history.replaceState({
  argument: initialProps.initialArgument,
  argumentsForPremises: initialProps.initialArgumentsForPremises,
  editing: initialProps.initialEditing,
  nextForConclusion: initialProps.initialNextForConclusion,
  seenSoFar: initialProps.initialSeenSoFar,
}, 'Wikisophia', window.location);
render(initialProps);
