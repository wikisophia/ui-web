export default function newContact(config) {
  return function handler(req, res) {
    res.contentType('text/html').render('contact', {
      resourcesRoot: config.staticResources.url,
    });
  };
}
