import * as Router from 'koa-router';
import {Context} from 'koa';


interface RequestBase {
    headers: object;
}

export interface RequestWithBody<R> extends RequestBase{
    body: R;
}

export interface RequestWithoutBody extends RequestBase {}

export interface Response<B, S extends number> {
    status: S;
    body: B;
}

export type HandlerWithBody<R, B, S extends number> =
    (request: RequestWithBody<R>) => Promise<Response<B, S>> | Response<B, S>;

export type HandlerWithNoBody<B, S extends number> =
    (request: RequestWithoutBody) => Promise<Response<B, S>> | Response<B, S>;

export function get<B, S extends number>(path: string, handler: HandlerWithNoBody<B, S>): (router: Router) => void {
    return (router) => {
        console.log('Registering route for GET', path);
        router.get(path, async (ctx: Context) => setResponse(
            ctx,
            await handler({
                headers: ctx.request.headers
            })
        ));
    }
}
export function post<R, B, S extends number>(path: string, handler: HandlerWithBody<R, B, S>): (router: Router) => void {
    return (router) => {
        console.log('Registering route for POST', path);
        router.post(path, async (ctx: Context) => setResponse(
            ctx,
            await handler({
                headers: ctx.request.headers,
                body: ctx.request.body
            })
        ));
    }
}

function setResponse<B, S extends number>(ctx: Context, {body, status}: Response<B, S>) {
    ctx.body = body;
    ctx.status = status;
}
