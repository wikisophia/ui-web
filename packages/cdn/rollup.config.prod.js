import devConfig from './rollup.config.dev';
import {uglify} from 'rollup-plugin-uglify';

export default devConfig.map((bundle) => Object.assign({}, bundle, {
  plugins: bundle.plugins.concat([uglify()])
}));
