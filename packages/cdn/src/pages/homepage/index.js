import { cancelRequest, listUpdater, makeRequest } from './helpers';

/**
 * @typedef {Object} SuggestionsConfig
 *
 * @property {string} inputID The ID of the element where the user inputs search terms.
 * @property {string} suggestionsID The ID of the "ul" element where suggestions should be shown.
 * @property {string} suggestionAPIAuthority The URI Authority where /suggestions lives.
 */

function suggestionUpdater(suggestionAPIAuthority, inputNode, suggestionsNode) {
  let xhr;
  return () => {
    cancelRequest(xhr);
    xhr = makeRequest(suggestionAPIAuthority, inputNode.value, listUpdater(suggestionsNode));
  };
}

function searchHandler(inputNode) {
  return (ev) => {
    if (ev.keyCode === 13) {
      window.location = `/arguments?conclusion=${encodeURIComponent(inputNode.value)}`;
    }
  };
}


// Listen for changes on the input element. When it changes, call the server
// for suggestions and update the suggestion list with the results.
const { inputId, suggestionsId, apiAuthority } = JSON.parse(document.getElementById('homepage-props').innerHTML);
const inputNode = document.getElementById(inputId);
const suggestionsNode = document.getElementById(suggestionsId);
inputNode.addEventListener('input', suggestionUpdater(apiAuthority, inputNode, suggestionsNode));
inputNode.addEventListener('keypress', searchHandler(inputNode));
