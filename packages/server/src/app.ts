import * as express from 'express';
import * as bodyParser from 'body-parser';
import setRoutes from './routes';
import * as exphbs from 'express-handlebars';
import {join} from 'path';

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
setRoutes(router);
app.use('/', router);

export default app;
