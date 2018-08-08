import * as Koa from 'koa';
import { equal, valueAt } from './utils';
import { AccessControl, Permission } from 'accesscontrol';
import { Action, Options } from './interfaces';
import { AuthorizationError } from './errors';

let accesscontrol: AccessControl;
let rolel: string;

function Authorization(grants: any, roleLocation: string) {
  accesscontrol = new AccessControl(grants);
  rolel = roleLocation;

  return (options: Options) => {
    return async (ctx: Koa.Context, next: () => Promise<any>): Promise<any> => {
      authorization(ctx, options, Action.Request);
      await next();
      authorization(ctx, options, Action.Response);
    };
  };
}

function authorization(ctx: any, options: Options, action: Action) {
  const role = valueAt(ctx, rolel);

  if (!role || !accesscontrol.hasRole(role)) {
    throw new AuthorizationError('unauthorized_error', 'Wrong role provided or undefined');
  }

  const actions: {own?: string; any?: string} = {}; // Add an option to extend methods and actions used
  const query: any = accesscontrol.can(role);

  switch (ctx.request.method) {
    case 'POST' :
      actions.any = 'createAny';
      actions.own = 'createOwn';
      break;
    case 'PUT' || 'PATCH':
      actions.any = 'updateAny';
      actions.own = 'updateOwn';
      break;
    case 'GET' :
      actions.any = 'readAny';
      actions.own = 'readOwn';
      break;
    case 'DELETE' :
      actions.any = 'deleteAny';
      actions.own = 'deleteOwn';
      break;
    default:
      throw new Error('invalid_action');
  }

  let permission: Permission;

  if (options.operands) {
    if (options.operands.length !== 2) {
      throw new Error('operands_error');
    }

    const values = [];
    for (const operand of options.operands) {
      values.push(valueAt(ctx, operand));
    }

    if (equal(values)) {
      permission = query[actions.own](options.resource);
    } else {
      permission = query[actions.any](options.resource);
    }
  } else {
    permission = query[actions.any](options.resource);
  }

  if (!permission.granted) {
    throw new AuthorizationError('unauthorized_error', 'Unauthorized Error');
  }

  if (action === Action.Request && ctx.request.body) { // Filter request body
    ctx.request.body = permission.filter(ctx.request.body);
  } else if (action === Action.Response) { // Filter response body
    ctx.response.body = permission.filter(ctx.response.body);
  }
}

export {
  Authorization,
};
