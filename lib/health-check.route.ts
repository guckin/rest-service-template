import {get, Response} from "./router";

export const ping = get<undefined, 200>({
    path: '/ping',
    handler: async (): Promise<Response<undefined, 200>> => ({status: 200, body: undefined})
});
