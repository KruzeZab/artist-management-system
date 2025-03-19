import { IncomingMessage, ServerResponse } from 'http';

import { HttpStatus, RouteHandler } from '../interfaces/server';
import {
  DYNAMIC_ROUTE_PARAM_REGEX,
  DYNAMIC_ROUTE_REPLACE_REGEX,
  protectedRoutes,
  publicRoutes,
} from '../constants/routes';

/**
 * Handles sending response to client
 *
 */
export const sendResponseToClient = (
  res: ServerResponse,
  statusCode: HttpStatus,
  data: unknown,
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

/**
 * Create response object to send response to controller
 *
 */
export const sendApiResponse = (options: {
  status: HttpStatus;
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any;
}): {
  status: number;
  success: boolean;
  response: { [key: string]: string | number | string[] | undefined };
} => ({
  status: options.status,
  success: options.success,
  response: options.response,
});

/**
 * Find the appropriate dynamic route for the routing
 * from client side
 *
 */
export const findRoute = (
  path: string,
  routes: Record<string, RouteHandler>,
) => {
  let route = routes[path];
  const params: Record<string, string> = {};

  if (!route) {
    for (const routePath in routes) {
      if (routePath.includes('/:')) {
        const regexPath = routePath.replace(
          DYNAMIC_ROUTE_PARAM_REGEX,
          DYNAMIC_ROUTE_REPLACE_REGEX,
        );
        const regex = new RegExp(`^${regexPath}$`);

        const match = path.match(regex);

        if (match) {
          route = routes[routePath];

          const paramNames =
            routePath.match(/:([^/]+)/g)?.map((p) => p.slice(1)) || [];

          const paramValues = match.slice(1);
          paramNames.forEach((name, index) => {
            params[name] = paramValues[index];
          });

          break;
        }
      }
    }
  }

  return { route: route || routes['notFound'], params };
};

/**
 * Check if the url is protected route
 *
 */
export const isProtectedRoute = (path: string) => {
  if (publicRoutes.includes(path)) {
    return false;
  }

  return protectedRoutes.some((protectedPath) => {
    const protectedSegments = protectedPath.split('/');
    const pathSegments = path.split('/');

    if (protectedSegments.length !== pathSegments.length) {
      return false;
    }

    return protectedSegments.every(
      (seg, i) => seg.startsWith(':') || seg === pathSegments[i],
    );
  });
};

/**
 * Handle Cors for browser requests
 *
 */
export const handleCors = (req: IncomingMessage, res: ServerResponse) => {
  const origin = req.headers.origin || '';

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, PUT, OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // If it's an OPTIONS request, respond immediately
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }
};
