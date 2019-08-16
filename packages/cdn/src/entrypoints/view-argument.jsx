import newClient from '@wikisophia/api-arguments-client';
import React from 'react';
import ReactDOM from 'react-dom';

import ImprovableArgument from '../components/ImprovableArgument';

const {
  id,
  apiArguments,
  premises,
  conclusion,
} = JSON.parse(document.getElementById('argument-props').innerHTML);

ReactDOM.render(
  <ImprovableArgument
    premises={premises}
    conclusion={conclusion}
    onSave={(argument) => {
      const api = newClient({
        url: apiArguments,
        fetch,
      });
      api.update(id, argument).then((response) => {
        window.location = `/arguments/${response.argument.id}`;
      }).catch((err) => {
        console.error(err);
      });
    }}
  />,
  document.getElementById('argument-anchor'),
);
