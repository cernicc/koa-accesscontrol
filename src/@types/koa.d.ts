import * as koa from 'koa';

declare module 'koa' {
  export interface Request {
    body: any;
  }
}
