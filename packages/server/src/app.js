import express from 'express';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';
import { join } from 'path';
import { setRoutes } from './routes';

/**
 * Make a new instance of the app.
 *
 * @param {Config} config The values for the app config.
 */
export default function newApp(config) {
  const app = express();
  app.engine('handlebars', exphbs({
    partialsDir: join(__dirname, '..', 'views', 'partials'),
    compilerOptions: {
      strict: true,
    },
  }));
  app.set('views', join(__dirname, '..', 'views'));
  app.set('view engine', 'handlebars');

  app.use(bodyParser.json());

  const router = express.Router();
  setRoutes(config, router);
  app.use('/', router);

  return app;
}

/**
 * @typedef {import('./config').Config} Config
 */
