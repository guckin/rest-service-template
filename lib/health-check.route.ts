import {get} from "./router";

export const ping = get<undefined, 200>('/ping', async () => {
    return {
        status: 200,
        body: undefined
    };
});
