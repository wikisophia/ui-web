import devConfig from './dev.rollup.config';
import uglify from 'rollup-plugin-uglify';

devConfig.forEach((bundle) => {
  bundle.plugins.push(uglify());
});

export default devConfig;
