import url from 'url';
import { IncomingMessage, ServerResponse } from 'http';

import routes from '../routes';

import { GET } from '../constants/methods';
import { protectedRoutes } from '../constants/routes';

import { findRoute } from '../utils/server';
import { parseQueryParams } from '../utils/string';

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
    };

    const { route, params } = findRoute(path, routes);
    data.routeParams = params;

    if (protectedRoutes.has(path)) {
      authenticate(req, res, () => route(data, res));
    } else {
      route(data, res);
    }
  });
};

export default requestHandler;
