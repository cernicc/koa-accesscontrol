import * as Koa from "koa";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";
import * as request from "supertest";
import { expect } from "chai";
import { Authorization } from "../src";
import grants from "./grants";
import { users, Header, user1 } from "./data";
import errorHandler from "./error-handler";

describe("Authorization", () => {
    const app = new Koa();
    const router = new Router();
    const auth = Authorization(grants, `request.headers.${Header.USER_ROLE}`);

    app.use(errorHandler());
    app.use(bodyParser());

    // Setup routes
    router.post(
        "/users",
        auth({
            resource: "users",
        }),
        (ctx, next) => {
            ctx.body = ctx.request.body;
        },
    );

    router.get(
        "/users",
        auth({
            resource: "users",
        }),
        (ctx, next) => {
            ctx.body = users;
        },
    );

    router.get(
        "/users/:uuid",
        auth({
            resource: "users",
            operands: [`request.headers.${Header.USER_UUID}`, `params.uuid`],
        }),
        (ctx, next) => {
            ctx.body = user1;
        },
    );

    router.put(
        "/users/:uuid",
        auth({
            resource: "users",
            operands: [`request.headers.${Header.USER_UUID}`, `params.uuid`],
        }),
        (ctx, next) => {
            ctx.body = user1;
        },
    );

    router.delete(
        "/users/:uuid",
        auth({
            resource: "users",
            operands: [`request.headers.${Header.USER_UUID}`, `params.uuid`],
        }),
        (ctx, next) => {
            ctx.body = user1;
        },
    );

    // Use routes
    app.use(router.routes()).use(router.allowedMethods());

    // Specify tests
    it("should fail if wrong header provided", () => {
        return request(app.callback())
            .get("/users/U1")
            .set("x-wrong-header", "user")
            .expect(403)
            .then((response) => {
                expect(response.body.code).to.equal("unauthorized_error");
            });
    });

    it("should fail if wrong role provided", () => {
        return request(app.callback())
            .get("/users/U1")
            .set(Header.USER_ROLE, "wrong")
            .expect(403)
            .then((response) => {
                expect(response.body.code).to.equal("unauthorized_error");
            });
    });

    describe("request body", () => {
        it("should filter out unallowed body params", () => {
            return request(app.callback())
                .post("/users")
                .set(Header.USER_ROLE, "user")
                .set("Accept", "application/json")
                .send({ uuid: "UU", firstname: "john", lastname: "Doe" })
                .expect(200)
                .then((response) => {
                    expect(response.body.uuid).to.equal("UU");
                    expect(response.body.firstname).to.be.an("undefined");
                });
        });
    });

    describe("admin", () => {
        it("should return all users", () => {
            return request(app.callback())
                .get("/users")
                .set(Header.USER_ROLE, "admin")
                .expect(200)
                .then((response) => {
                    expect(response.body).to.have.length(3);
                });
        });

        it("should fetch one user", () => {
            return request(app.callback())
                .get("/users/U1")
                .set(Header.USER_ROLE, "admin")
                .expect(200)
                .then((response) => {
                    expect(response.body).to.deep.equal(user1);
                });
        });

        it("should be able to update a user", () => {
            return request(app.callback())
                .put("/users/U1")
                .set(Header.USER_ROLE, "admin")
                .expect(200)
                .then((response) => {
                    expect(response.body).to.deep.equal(user1);
                });
        });

        it("should be able to delete a user", () => {
            return request(app.callback())
                .delete("/users/U1")
                .set(Header.USER_ROLE, "admin")
                .expect(200)
                .then((response) => {
                    expect(response.body).to.deep.equal(user1);
                });
        });
    });

    describe("user", () => {
        it("getting all users should fail", () => {
            return request(app.callback())
                .get("/users")
                .set(Header.USER_ROLE, "user")
                .expect(403)
                .then((response) => {
                    expect(response.body.code).to.equal("unauthorized_error");
                });
        });

        it("should return data about current user", () => {
            return request(app.callback())
                .get("/users/U1")
                .set(Header.USER_ROLE, "user")
                .set(Header.USER_UUID, "U1")
                .expect(200)
                .then((response) => {
                    expect(response.body.firstname).to.equal(user1.firstname);
                    expect(response.body.lastname).to.equal(user1.lastname);
                    expect(response.body.email).to.be.an("undefined");
                });
        });

        it("should fail when geting data about other users", () => {
            return request(app.callback())
                .get("/users/U2")
                .set(Header.USER_ROLE, "user")
                .set(Header.USER_UUID, "U1")
                .expect(403)
                .then((response) => {
                    expect(response.body.code).to.equal("unauthorized_error");
                });
        });

        it("should be able to update data about yourself", () => {
            return request(app.callback())
                .put("/users/U1")
                .set(Header.USER_ROLE, "user")
                .set(Header.USER_UUID, "U1")
                .expect(200)
                .then((response) => {
                    expect(response.body.uuid).to.be.an("undefined");
                    expect(response.body.firstname).to.equal(user1.firstname);
                    expect(response.body.lastname).to.equal(user1.lastname);
                    expect(response.body.email).to.equal(user1.email);
                    expect(response.body.phone).to.equal(user1.phone);
                });
        });

        it("should fail if updating data for other user", () => {
            return request(app.callback())
                .put("/users/U2")
                .set(Header.USER_ROLE, "user")
                .set(Header.USER_UUID, "U1")
                .expect(403)
                .then((response) => {
                    expect(response.body.code).to.equal("unauthorized_error");
                });
        });

        it("should be able to delete yourself", () => {
            return request(app.callback())
                .delete("/users/U1")
                .set(Header.USER_ROLE, "user")
                .set(Header.USER_UUID, "U1")
                .expect(200)
                .then((response) => {
                    expect(response.body.uuid).to.equal(user1.uuid);
                });
        });

        it("should fail if deleting other user", () => {
            return request(app.callback())
                .delete("/users/U2")
                .set(Header.USER_ROLE, "user")
                .set(Header.USER_UUID, "U1")
                .expect(403)
                .then((response) => {
                    expect(response.body.code).to.equal("unauthorized_error");
                });
        });
    });
});
