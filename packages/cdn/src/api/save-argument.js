// Save a new argument. If successful, callback will be called with the URL of the new argument.
// If not, callback will be called with null, and the second argument will be an error message.
export default function save(apiAuthority, argument, callback) {
  // If the API will reject them anyway, we may as well save the server trip.
  if (typeof argument.conclusion !== 'string' || argument.conclusion.length === 0) {
    callback(null, new Error('Can\'t save an argument with no conclusion.'));
    return;
  }
  argument.premises = argument.premises.filter(premise => typeof premise === 'string' && premise.length > 0);
  if (argument.premises.length < 2) {
    callback(null, new Error(`An argument requires at least two premises.`));
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
  ajax.send(JSON.stringify(argument));
}
