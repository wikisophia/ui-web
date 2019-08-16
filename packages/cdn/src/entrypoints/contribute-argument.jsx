import newClient from '@wikisophia/api-arguments-client';
import React from 'react';
import ReactDOM from 'react-dom';

import ImprovingArgument from '../components/ImprovingArgument';

document.getElementsByClassName('argument-area')[0].classList.remove('hidden');

const {
  id,
  apiArguments,
  initialPremises,
  initialConclusion,
} = JSON.parse(document.getElementById('argument-props').innerHTML);

const onCancel = id ? () => {
  window.location = window.location.href.replace('/improve', '');
} : null;
ReactDOM.render(
  <ImprovingArgument
    initialPremises={initialPremises}
    initialConclusion={initialConclusion}
    onSave={(argument) => {
      const api = newClient({
        url: apiArguments,
        fetch,
      });
      const call = id ? api.update(id, argument) : api.save(argument);
      call.then((response) => {
        window.location = response.location;
      }).catch((err) => {
        console.error(err);
      });
    }}
    onCancel={onCancel}
  />,
  document.getElementById('argument-anchor'),
);
