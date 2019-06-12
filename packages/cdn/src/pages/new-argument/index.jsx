import newClient from '@wikisophia/api-arguments-client';
import React from 'react';
import ReactDOM from 'react-dom';

import { EditableArgument } from '../../components/EditableArgument';

const props = JSON.parse(document.getElementById('new-argument-props').innerHTML);
props.api = newClient({
  url: props.apiUrl,
  fetch: fetch,
});
delete props.apiUrl;

ReactDOM.render(
  React.createElement(EditableArgument, props),
  document.getElementById("new-argument-anchor"));
