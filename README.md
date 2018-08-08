# koa-accesscontrol
> This is koa middleware for [accesscontrol](https://onury.io/accesscontrol/)

Middleware filters request body and also response body.

## Installation
```
npm i koa-accesscontrol
```

## Usage Example

Grants are loaded from file or database.

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

Use grants object when initializing the Middleware. Also specify the location of user role.


```js
import { Authorization } from "koa-accesscontrol";
import grants from "./grants";

const auth = Authorization(grants, `request.headers.${Header.USER_ROLE}`);

.
.
.

router.get('/users',
  auth({
    resource: 'users',
  }), (ctx, next) => {
    ctx.body = "Something";
  });

router.get('/users/:uuid',
  auth({
    resource: "users",
    operands: [`request.headers.${Header.USER_UUID}`, `params.uuid`],
  }), (ctx, next) => {
    ctx.body = "Something";
  });
```

## Todo
* Allow to overwrite actions used for methods
* Use typed context in authorization
