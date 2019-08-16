const CssBuilder = require('clean-css');
const fs = require('fs-extra');

// Take all the .css files from src/entrypoints, minify them, and write them
// to dist/ with the same filenames.

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

const entrypoints = `${__dirname}/src/entrypoints`;

function buildCSS(file) {
  if (file.endsWith('.css')) {
    fs.readFile(`${entrypoints}/${file}`).then(outputCSS(`${__dirname}/dist/${file}`)).catch(printErr);
  }
}

function buildAllCSS(files) {
  files.forEach(buildCSS);
}

fs.readdir(entrypoints).then(buildAllCSS);
