# koa-accesscontrol
> This is koa middleware for [accesscontrol](https://onury.io/accesscontrol/)

Middleware filters request body and also response body.

## Installation
```
npm i koa-accesscontrol
```

## Grants
Grants can be loaded from the database or file.
```js
export default {
  admin: {
    users: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },
  user: {
    users: {
      'create:any': ['uuid'],
      'read:own': ['uuid', 'firstname', 'lastname'],
      'update:own': ['firstname', 'lastname', 'email', 'phone'],
      'delete:own': ['uuid'],
    },
  },
};

```

## Usage Example
Use grants object when initializing the Middleware. Also specify the location of user role.
If no operands are specified when using the middleware, checking the ownership of the resource will be skipped.

### TypeScript

```typescript
import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Authorization } from 'koa-accesscontrol';

const grants = {
  user: {
    users: {
      'create:any': ['uuid'],
      'read:own': ['uuid', 'firstname', 'lastname'],
      'update:own': ['firstname', 'lastname', 'email', 'phone'],
      'delete:own': ['uuid'],
    },
  },
};

const app = new Koa();
const router = new Router();
const auth = Authorization(grants, `request.headers.x-something-role`);

router.get('/users',
  auth({
    resource: 'users',
  }), (ctx, next) => {
    ctx.body = 'All users';
  });

router.get('/users/:uuid',
  auth({
    resource: 'users',
    operands: [`request.headers.x-something-uuid`, `params.uuid`],
  }), (ctx, next) => {
    ctx.body = 'One user';
  });

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080);
```

### JavaScript

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const { Authorization } = require('koa-accesscontrol');

const grants = {
  user: {
    users: {
      'create:any': ['uuid'],
      'read:own': ['uuid', 'firstname', 'lastname'],
      'update:own': ['firstname', 'lastname', 'email', 'phone'],
      'delete:own': ['uuid'],
    },
  },
};

const app = new Koa();
const router = new Router();
const auth = Authorization(grants, `request.headers.x-something-role`);

router.get('/users',
  auth({
    resource: "users",
  }), (ctx, next) => {
    ctx.body = "All users";
  });

router.get('/users/:uuid',
  auth({
    resource: "users",
    operands: [`request.headers.x-something-uuid`, `params.uuid`],
  }), (ctx, next) => {
    ctx.body = "One user";
  });

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080);
```

## Todo
* Enable option to overwrite actions used for methods
