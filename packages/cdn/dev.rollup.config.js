import babelrc from 'babelrc-rollup';
import babel from 'rollup-plugin-babel';
import css from 'rollup-plugin-css-only';
import uglify from 'rollup-plugin-uglify';
import importResolution from 'rollup-plugin-node-resolve';
import fs from 'fs';

const inputs = [
  'add-argument',
  'argument',
  'homepage',
]

function plugins(input) {
  return [
    babel(babelrc({
      path: `${__dirname}/browser.babelrc`,
      addModuleOptions: false
    })),
    importResolution({
      extensions: ['', '.js', '.jsx']
    }),
    css({ output: `${input}.css` })
  ];
}

function resolveInputFile(input) {
  if (fs.existsSync(`src/${input}/index.jsx`)) {
    return `src/${input}/index.jsx`
  } else {
    return `src/${input}/index.js`;
  }
}

export default inputs.map((input) => {
  return {
    input: resolveInputFile(input),
    output: {
      file: `${__dirname}/dist/${input}.js`,
      format: 'iife',
      name: 'wikisophia'
    },
    plugins: plugins(input)
  };
})
