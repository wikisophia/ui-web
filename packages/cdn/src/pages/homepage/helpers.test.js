import xhrmock from 'xhr-mock';
import { listUpdater, makeRequest, cancelRequest } from './helpers';

function useXHRMocks() {
  beforeEach(() => {
    xhrmock.setup();
  });
  afterEach(() => {
    xhrmock.teardown();
  });
}

describe('The list updaters', () => {
  test('update the suggestions list', () => {
    const suggestionsNode = document.createElement('ul');
    const updater = listUpdater(suggestionsNode);

    const first = 'socrates is a man';
    const second = 'socrates is mortal';
    updater([first, second]);

    expect(suggestionsNode.childElementCount).toBe(2);
    expect(suggestionsNode.firstChild.firstChild.innerHTML).toBe(first);
    expect(suggestionsNode.firstChild.firstChild.href).toBe('http://localhost/arguments?conclusion=socrates%20is%20a%20man');
    expect(suggestionsNode.lastChild.firstChild.innerHTML).toBe(second);
    expect(suggestionsNode.lastChild.firstChild.href).toBe('http://localhost/arguments?conclusion=socrates%20is%20mortal');
  });
});

describe('makeRequest()', () => {
  useXHRMocks();

  test('calls the right endpoint', (done) => {
    const query = 'soc';
    const apiAuthority = 'api.wikisophia.net';

    xhrmock.use((req, resp) => {
      expect(req.method()).toBe('GET');
      expect(req.url().path).toBe('//api.wikisophia.net/suggestions');
      expect(req.url().query.q).toBe(query);
      done();
      return resp.status(404);
    });

    makeRequest(apiAuthority, query, () => {});
  });

  test('runs the callback with the response payload', (done) => {
    const suggestions = '["socrates is mortal", "socrates is a man"]';
    xhrmock.use((req, resp) => resp.status(200)
      .headers({ 'Content-Type': 'application/json' })
      .body(suggestions));

    const callback = jest.fn((serverSuggestions) => {
      expect(serverSuggestions).toEqual(JSON.parse(suggestions));
      done();
    });

    makeRequest('whatever', 'soc', callback);
  });
});

describe('cancelRequest()', () => {
  useXHRMocks();

  test('removes the handler and calls abort', () => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {};
    xhr.abort = jest.fn();

    cancelRequest(xhr);

    expect(xhr).not.toHaveProperty('onreadystatechange');
    expect(xhr.abort.mock.calls.length).toBe(1);
  });
});
