# Wikisophia UI

This monorepo powers the front-end for [Wikisophia](www.wikisophia.net).

The [server](./packages/server) package serves all the endpoints used by the web.
It runs through Node, and will (eventually) be packaged with Docker.

The [pages](./packages/pages) package publishes JS and CSS files which will be run in the browser.
These are published as a separate package to and fetched through [JsDelivr](https://www.jsdelivr.com/).
