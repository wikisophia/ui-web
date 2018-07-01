# Wikisophia UI

This monorepo powers the web front-end for [Wikisophia](www.wikisophia.net).

The code is divided up into [server](./packages/server) and [pages](./packages/pages) so
that [JsDelivr](https://www.jsdelivr.com/) can be used as a CDN.

## Installation

Downlaod and install [Node](https://nodejs.org/en/download/).

From the project root, run:

```sh
npm install
npm run install
```

Start the server with:

```sh
npm run serve
```

Open a browser and go to `http://localhost:4040` for the homepage.
The full API can be found [in the code](./packages/server/src/routes.ts).

## Running the API Servers

Wikisophia is run by microservices. The UI generally works, but you'll also
need to run the API servers if you want to run the site as a whole.

The API servers can be found [on GitHub](https://github.com/wikisophia?utf8=%E2%9C%93&q=api&type=&language=).
