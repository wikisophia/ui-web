import { cancelRequest, listUpdater, makeRequest } from './helpers';

/**
 * @typedef {Object} SuggestionsConfig
 *
 * @property {string} inputID The ID of the element where the user inputs search terms.
 * @property {string} suggestionsID The ID of the "ul" element where suggestions should be shown.
 * @property {string} suggestionAPIAuthority The URI Authority where /suggestions lives.
 */

function logErr(msg) {
  if (console && console.error) {
    console.error(msg);
  }
}


function suggestionUpdater(suggestionAPIAuthority, inputNode, suggestionsNode) {
  let xhr;
  return () => {
    cancelRequest(xhr);
    xhr = makeRequest(suggestionAPIAuthority, inputNode.value, listUpdater(suggestionsNode));
  };
}

/**
 * Listen for changes on the input element. When it changes, call the server
 * for suggestions and update the suggestion list with the results.
 *
 * @param {SuggestionsConfig} cfg Inputs with the page IDs and server to call.
 */
export function showSuggestions(cfg) {
  const inputNode = document.getElementById(cfg.inputID);
  const suggestionsNode = document.getElementById(cfg.suggestionsID);
  if (!inputNode) {
    logErr(`No HTML node found with id="${cfg.inputID}". Dynamic suggestions will not be shown.`);
    return;
  }
  if (!suggestionsNode) {
    logErr(`No HTML node found with id="${cfg.suggestionsID}". Dynamic suggestions will not be shown.`);
    return;
  }

  inputNode.addEventListener('input', suggestionUpdater(cfg.suggestionAPIAuthority, inputNode, suggestionsNode));
}
