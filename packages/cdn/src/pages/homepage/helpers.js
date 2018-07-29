
// This file exports some functions so that they can be testable,
// but not public in the final bundle.

export function listUpdater(suggestionsNode) {
  return (suggestions) => {
    suggestionsNode.innerHTML = '';

    suggestions.forEach((suggestion) => {
      const link = document.createElement('a');
      link.href = `/arguments?conclusion=${encodeURIComponent(suggestion)}`;
      link.textContent = suggestion;
      const item = document.createElement('li');
      item.className = 'suggestion';
      item.appendChild(link);
      suggestionsNode.appendChild(item);
    });
  };
}

export function makeRequest(suggestionAPIAuthority, query, onSuccess) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `//${suggestionAPIAuthority}/suggestions?q=${encodeURIComponent(query)}`);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      onSuccess(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
  return xhr;
}

export function cancelRequest(xhr) {
  if (xhr) {
    delete xhr.onreadystatechange;
    if (xhr.abort) {
      xhr.abort();
    }
  }
}
