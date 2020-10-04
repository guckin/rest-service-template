import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import {Config} from "./config";
import {Middleware} from 'koa';
import {routes} from './routes';

const router = getRouter();

startApplication({
    port: 8080
}, [
    bodyParser(),
    router.routes(),
    router.allowedMethods()
]);

function getRouter() {
    const router = new Router();
    routes.forEach((route) => route(router));
    return router;
}

function startApplication({port}: Config, middleware: Middleware[]) {
    const app = new Koa();
    middleware.forEach(mw => app.use(mw));
    app.listen(port, () => {
        console.log('Starting server on port', port);
    });
}
