const CssBuilder = require('clean-css');
const fs = require('fs-extra');

function printErr(reason) {
  console.log(reason);
}

function ensureString(bufOrString) {
  if (typeof bufOrString === 'string') {
    return bufOrString
  }
  return bufOrString.toString('utf8');
}

const css = new CssBuilder({
  returnPromise: true
});

function minify(file) {
  return fs.readFile(file).then(ensureString).then(css.minify.bind(css));
}

function printAll(elements, printer) {
  if (elements && elements.forEach) {
    elements.forEach(printer);
  }
}

function unpackStyles(outputObj) {
  printAll(outputObj.warnings, console.warn);
  printAll(outputObj.errors, console.error);
  return outputObj.styles;
}

function outputCSS(file) {
  return function(bufOrString) {
    return css.minify(ensureString(bufOrString)).
      then(unpackStyles).
      then(fs.outputFile.bind(fs, file));
  }
}

fs.readFile(`${__dirname}/src/fragments/global.css`).then(outputCSS(`${__dirname}/dist/fragments/global.css`)).catch(printErr);
fs.readFile(`${__dirname}/src/homepage/index.css`).then(outputCSS(`${__dirname}/dist/homepage.css`)).catch(printErr);
fs.readFile(`${__dirname}/src/add-argument/index.css`).then(outputCSS(`${__dirname}/dist/add-argument.css`)).catch(printErr);
fs.readFile(`${__dirname}/src/argument/index.css`).then(outputCSS(`${__dirname}/dist/argument.css`)).catch(printErr);
fs.readFile(`${__dirname}/src/arguments/index.css`).then(outputCSS(`${__dirname}/dist/arguments.css`)).catch(printErr);
