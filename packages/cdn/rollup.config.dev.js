import babelrc from 'babelrc-rollup';
import babel from 'rollup-plugin-babel';
import importResolution from 'rollup-plugin-node-resolve';
import fs from 'fs';

const inputs = [
  'new-argument',
  'argument',
  'homepage',
]

function plugins(input) {
  return [
    babel(babelrc({
      path: `${__dirname}/browser.babelrc`,
      addModuleOptions: false,
      addExternalHelpersPlugin: false,
    })),
    importResolution({
      extensions: ['', '.js', '.jsx']
    })
  ];
}

function resolveInputFile(input) {
  if (fs.existsSync(`src/pages/${input}/index.jsx`)) {
    return `src/pages/${input}/index.jsx`
  } else {
    return `src/pages/${input}/index.js`;
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
