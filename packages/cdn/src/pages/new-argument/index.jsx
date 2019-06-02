import React from 'react';
import ReactDOM from 'react-dom';

import { EditableArgument } from '../../components/EditableArgument';

const props = document.getElementById('new-argument-props').innerHTML;

ReactDOM.render(
  React.createElement(EditableArgument, JSON.parse(props)),
  document.getElementById("new-argument-anchor"));
