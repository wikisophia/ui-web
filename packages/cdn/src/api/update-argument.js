
export default function update(apiAuthority, argumentId, premises, callback) {
  // premises = premises.filter((premise) => typeof premise === 'string' && premise.length > 0);
  // if (premises.length < 2) {
  //   callback(null, new Error(`An argument requires at least two premises. Yours was: ${JSON.stringify(premises)}`));
  //   return;
  // }

  const ajax = new XMLHttpRequest();
  ajax.addEventListener('load', (ev) => {
    if (ev.target.status >= 200 && ev.target.status < 300) {
      callback()
    } else if (ev.target.status >= 400 && ev.target.status < 500) {
      callback(null, new Error(`Could not save argument. Server responded with ${ev.target.status}. Please report this bug.`));
    } else {
      callback(null, new Error(`Could not save argument. Server responded with ${ev.target.status}. Try again later. If this problem persists, please report it.`));
    }
  });
  ajax.open('PATCH', `//${apiAuthority}/arguments/${argumentId}`);
  ajax.send(JSON.stringify({
    premises: premises
  }));
}