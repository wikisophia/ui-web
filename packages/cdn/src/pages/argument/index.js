import ArgumentEditor from '../../components/ArgumentEditor';

export class ViewArgument extends React.Component {
  // props.apiAuthority: string
  // props.argumentId: string
  // props.conclusion: string
  // props.premises: string[]
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };

    this.save = this.save.bind(this);
    this.startEditing = this.startEditing.bind(this);
  }

  save(argument) {
    if (argument.conclusion === this.props.conclusion) {
      const ajax = new XMLHttpRequest();
      ajax.addEventListener('load', (ev) => {
        if (ev.target.status >= 200 && ev.target.status < 300) {
          window.location.reload(true);
        } else if (ev.target.status >= 400 && ev.target.status < 500) {
          throw new Error(`Could not save argument. Server responded with ${ev.target.status}. Please report this bug.`)
        } else {
          throw new Error(`Could not save argument. Server responded with ${ev.target.status}. Try again later. If this problem persists, please report it.`);
        }
      });
      ajax.open('PATCH', `//${this.props.apiAuthority}/arguments/${this.props.argumentId}`);
      ajax.send(JSON.stringify({
        premises: argument.premises
      }));
    }
    else {
      const ajax = new XMLHttpRequest();
      ajax.addEventListener('load', (ev) => {
        if (ev.target.status >= 200 && ev.target.status < 300) {
          window.location = ajax.getResponseHeader('Location');
        } else if (ev.target.status >= 400 && ev.target.status < 500) {
          throw new Error(`Could not save argument. Server responded with ${ev.target.status}. Please report this bug.`)
        } else {
          throw new Error(`Could not save argument. Server responded with ${ev.target.status}. Try again later. If this problem persists, please report it.`);
        }
      });
      ajax.open('POST', `//${this.props.apiAuthority}/arguments`);
      ajax.send(JSON.stringify(argument));
    }
  }

  startEditing() {
    this.setState({
      editing: true,
    });
  }

  render() {
    if (this.state.editing) {
      return (
        <ArgumentEditor
          conclusion={this.props.conclusion}
          premises={this.props.premises}
          onSave={this.save}
        />
      );
    }
    else {
      const premiseNodes = this.props.premises.map((premise) => {
        const href = `/argument?conclusion=${encodeURIComponent(premise)}`;
        return <li className="premise" key={premise}>
          <a className="premise-text" href={href}>{premise}</a>
        </li>;
      });
      return (
        <div>
          <button type="button" onClick={this.startEditing}>Edit this argument</button>
          <section className="conclusion">
            <h1>Conclusion</h1>
            <p className="conclusion-text">{this.props.conclusion}</p>
          </section>
          <p>because...</p>
          <section className="premises">
            <h1>Premises</h1>
            <ul id="premise-list">
              {premiseNodes}
            </ul>
          </section>
        </div>
      );
    }
  }
}


function onTag(tagName, listener) {
  return (ev) => {
    if (ev.target.tagName === tagName) {
      listener(ev);
    }
  };
}

function onClassName(className, listener) {
  return (ev) => {
    if (ev.target.classList.contains(className)) {
      listener(ev);
    }
  };
}

function makeEditable(premiseNode) {
  const inputNode = document.createElement('input');
  inputNode.type = 'text';
  inputNode.value = premiseNode.firstElementChild.textContent;
  premiseNode.innerHTML = '';
  premiseNode.appendChild(inputNode);
  inputNode.focus();
  // Removing the premise from the tab flow keeps shift + tab working.
  premiseNode.tabIndex = -1;
}

function newEditElement() {
  const elm = document.createElement('span');
  elm.classList.add('edit-premise');
  elm.textContent = '(edit)';
  elm.tabIndex = 0;
  return elm;
}

function setPremise(premiseNode, value) {
  const premiseText = document.createElement('a');
  premiseText.classList.add('premise-text');
  premiseText.textContent = value;
  premiseText.href = `/arguments?conclusion=${encodeURIComponent(value)}&limit=1`;
  premiseNode.innerHTML = '';
  premiseNode.appendChild(premiseText);
  premiseNode.appendChild(document.createTextNode(' '));
  premiseNode.appendChild(newEditElement());
}

function saveInput(inputNode) {
  const premiseNode = inputNode.parentNode;
  if (inputNode.value === '') {
    premiseNode.parentNode.removeChild(premiseNode);
  } else {
    setPremise(premiseNode, inputNode.value);
  }
}

function parseTextContents(nodelist) {
  const textContents = [];
  nodelist.forEach((node) => {
    textContents.push(node.textContent);
  });
  return textContents;
}

function saveVisibilitySyncer(getCurrentPremiseNodes, saveButton) {
  const originalPremises = parseTextContents(getCurrentPremiseNodes());
  function hasEdits() {
    const newPremises = parseTextContents(getCurrentPremiseNodes());
    if (originalPremises.length !== newPremises.length) {
      return true;
    }
    return originalPremises.some(premise => newPremises.indexOf(premise) === -1);
  }

  return function saveSyncer() {
    if (hasEdits()) {
      saveButton.classList.remove('no-edits');
    } else {
      saveButton.classList.add('no-edits');
    }
  };
}

function premiseSaver(getCurrentPremiseNodes, apiAuthority, argumentId, callback) {
  return () => {
    const premises = parseTextContents(getCurrentPremiseNodes());
    const ajax = new XMLHttpRequest();
    ajax.addEventListener('load', (ev) => {
      if (ev.target.status >= 200 && ev.target.status < 300) {
        callback();
      } else if (ev.target.status >= 400 && ev.target.status < 500) {
        callback(null, new Error(`Could not save argument. Server responded with ${ev.target.status}. Please report this bug.`));
      } else {
        callback(null, new Error(`Could not save argument. Server responded with ${ev.target.status}. Try again later. If this problem persists, please report it.`));
      }
    });
    ajax.open('PATCH', `//${apiAuthority}/arguments/${argumentId}`);
    ajax.send(JSON.stringify({
      premises,
    }));
  };
}

export function makePremisesEditable({
  apiAuthority,
  argumentId,
  premiseListId,
  premisesClass,
  saverId,
}) {
  const premiseListNode = document.getElementById(premiseListId);
  const saveButton = document.getElementById(saverId);
  const getCurrentPremiseNodes = premiseListNode.querySelectorAll.bind(premiseListNode, `.${premisesClass}`);

  function afterSave(value, err) {
    if (err) {
      const errNode = document.createElement('p');
      errNode.classList.add('server-error');
      errNode.textContent = err.message;
      saveButton.parentNode.appendChild(errNode);
    } else {
      saveButton.classList.add('no-edits');
    }
  }

  const syncSaveButton = saveVisibilitySyncer(getCurrentPremiseNodes, saveButton);

  saveButton.addEventListener('click', premiseSaver(getCurrentPremiseNodes, apiAuthority, argumentId, afterSave));

  premiseListNode.addEventListener('focusout', onTag('INPUT', (ev) => {
    saveInput(ev.target);
    syncSaveButton();
  }));

  premiseListNode.addEventListener('keypress', onTag('INPUT', (ev) => {
    if (ev.keyCode === 13) {
      saveInput(ev.target);
      syncSaveButton();
    }
  }));

  premiseListNode.addEventListener('focusin', onClassName('edit-premise', (ev) => {
    makeEditable(ev.target.parentNode);
  }));
}
