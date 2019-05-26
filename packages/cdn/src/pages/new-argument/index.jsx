import React from 'react';
import ReactDOM from 'react-dom';

import { Argument } from '../../containers/Argument';

const props = document.getElementById('new-argument-props').innerHTML;

ReactDOM.render(
  React.createElement(Argument, JSON.parse(props)),
  document.getElementById("new-argument-anchor"));
