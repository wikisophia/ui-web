import moment from 'moment';

export function log(msg) {
  console.log(`[${timestamp()}] ${msg}`); // eslint-disable-line no-console
}

export function debug(msg) {
  console.debug(`[${timestamp()}] ${msg}`); // eslint-disable-line no-console
}

function timestamp() {
  return moment().format('MMMM Do YYYY, h:mm:ss a');
}
