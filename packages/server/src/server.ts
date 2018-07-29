import app from './app';
import { serverPort, serverHost } from './config';

app.listen(serverPort, serverHost, () => {
  console.log(`Server listening on port ${serverPort}`);
});
