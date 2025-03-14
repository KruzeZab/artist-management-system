import http from 'http';

import serverConfig from './config/config';
import requestHandler from './handlers/requestHandler';

const server = http.createServer(requestHandler);

server.listen(serverConfig.serverPort, () => {
  console.log(`Serve listening on port ${serverConfig.serverPort}`);
});
