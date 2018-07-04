

function onClassName(className, listener) {
  return (ev) => {
    if (ev.target.classList.contains(className)) {
      listener(ev);
    }
  };
}

function handleDelete(ev) {
  const premiseElement = ev.target.parentNode;
  premiseElement.parentNode.removeChild(premiseElement);
}

function blankPremiseAdder(premiseListNode) {
  return () => {
    const newElement = document.createElement('li');
    newElement.className = 'premise-element';

    const premiseInput = document.createElement('input');
    premiseInput.type = 'text';
    premiseInput.className = 'premise-entry';
    premiseInput.placeholder = 'Add premise here';
    newElement.appendChild(premiseInput);

    newElement.appendChild(document.createTextNode(' '));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-premise';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    newElement.appendChild(deleteButton);

    premiseListNode.appendChild(newElement);
  };
}

function parseNonEmptyValues(inputs) {
  const values = [];
  inputs.forEach((input) => {
    if (input.value) {
      values.push(input.value);
    }
  });
  return values;
}

function argumentSaver(apiAuthority, conclusionNode, premiseListNode, premiseInputClass, callback) {
  return () => {
    const conclusion = conclusionNode.value;
    const premises = parseNonEmptyValues(premiseListNode.querySelectorAll(`.${premiseInputClass}`));
    if (!conclusion) {
      callback(null, new Error('A conclusion is required.'));
      return;
    }
    if (premises.length < 2) {
      callback(null, new Error('At least 2 premises are required.'));
      return;
    }

    const ajax = new XMLHttpRequest();
    ajax.timeout = 1000;
    ajax.addEventListener('readystatechange', () => {
      if (ajax.readyState === 2) {
        if (ajax.status >= 200 && ajax.status < 300) {
          callback(ajax.getResponseHeader('Location'));
        } else if (ajax.status >= 400 && ajax.status < 500) {
          callback(null, new Error(`Could not save argument. Server responded with ${ajax.status}. Please report this bug.`));
        } else {
          callback(null, new Error(`Could not save argument. Server responded with ${ajax.status}. Try again later. If this problem persists, please report it.`));
        }
      }
    });
    ajax.open('POST', `//${apiAuthority}/arguments`, true);
    ajax.setRequestHeader('Content-Type', 'application/json');
    ajax.send(JSON.stringify({
      conclusion,
      premises,
    }));
  };
}

function saveCallback(errNode) {
  return (newUrl, err) => {
    if (err) {
      errNode.textContent = err.message;
    } else {
      window.location = newUrl;
    }
  };
}

export function makeInteractive({
  apiAuthority,
  conclusionId,
  deletePremiseClass,
  errNodeId,
  newPremiseButtonId,
  premiseListId,
  premiseInputClass,
  saveArgumentId,
}) {
  const conclusionNode = document.getElementById(conclusionId);
  const errNode = document.getElementById(errNodeId);
  const premiseListNode = document.getElementById(premiseListId);
  const newPremiseButton = document.getElementById(newPremiseButtonId);
  const saveButton = document.getElementById(saveArgumentId);

  premiseListNode.addEventListener('click', onClassName(deletePremiseClass, handleDelete));
  newPremiseButton.addEventListener('click', blankPremiseAdder(premiseListNode));
  saveButton.addEventListener('click', argumentSaver(apiAuthority, conclusionNode, premiseListNode, premiseInputClass, saveCallback(errNode)));
}
