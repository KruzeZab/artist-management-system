import http from 'http';

import serverConfig from './config/config';
import requestHandler from './handlers/requesthandler';

const server = http.createServer(requestHandler);

server.listen(serverConfig.serverPort, () => {
  console.log(`Serve listening on port ${serverConfig.serverPort}`);
});
