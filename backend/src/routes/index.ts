import { RouteHandler } from '../interfaces/server';

const routes: Record<string, RouteHandler> = {
  kenny: (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello Kenny' }));
  },
  notFound: (req, res) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route Not Found' }));
  },
};

export default routes;
