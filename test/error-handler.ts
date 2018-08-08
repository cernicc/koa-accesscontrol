import * as Koa from 'koa';
import { AuthorizationError } from '../src/errors';

export default function() {
  return async (ctx: Koa.Context, next: () => Promise<any>): Promise<any> => {
    try {
      await next();
    } catch (err) {
      if (err instanceof AuthorizationError) {
        ctx.status = 403;
        ctx.body = {
          message: err.message,
          code: err.code,
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          message: 'Internal Error',
          code: 'internal_error',
        };
      }
    }
  };
}
