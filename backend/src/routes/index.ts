import { RouteHandler } from '../interfaces/server';

import { loginUser, registerUser } from '../controllers/auth.controller';

const routes: Record<string, RouteHandler> = {
  register: registerUser,
  login: loginUser,

  notFound: (req, res) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route Not Found' }));
  },
};

export default routes;
