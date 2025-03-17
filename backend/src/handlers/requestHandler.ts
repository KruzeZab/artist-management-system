import url from 'url';
import { IncomingMessage, ServerResponse } from 'http';

import routes from '../routes';

import { GET } from '../constants/methods';

import { parseQueryParams } from '../utils/string';
import { findRoute, isProtectedRoute } from '../utils/server';

import { authenticate } from '../middlewares/auth';

import { RequestData } from '../interfaces/server';

const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
  const parsedURL = url.parse(req.url || '', true);
  const path = parsedURL.pathname?.replace(/^\/+|\/+$/g, '') || '';

  const method = req.method?.toLowerCase() || GET;

  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', function () {
    let parsedBody;

    try {
      parsedBody = body ? JSON.parse(body) : {};
    } catch (error) {
      console.log(error);
      parsedBody = {};
    }

    const data: RequestData = {
      path,
      queryString: parseQueryParams(parsedURL.query),
      headers: req.headers,
      method,
      body: parsedBody,
      routeParams: {},
      user: {},
    };

    const { route, params } = findRoute(path, routes);
    data.routeParams = params;

    if (isProtectedRoute(path)) {
      authenticate(req, res, (user) => {
        data.user = user;

        route(data, res);
      });
    } else {
      route(data, res);
    }
  });
};

export default requestHandler;
