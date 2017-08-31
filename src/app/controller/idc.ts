import { Controller } from 'egg';

export default class IdcController extends Controller {
    public async read() {
        const { ctx, app } = this;
        const resp: any = {
            err: 0,
        };
        const data = await ctx.service.idc.getData(app.config.idc);

        if (data) {
            resp.dat = data;
        }
        else {
            resp.dat = null;
        }

        ctx.body = resp;
        ctx.status = 202;
    }
}

declare module 'egg' {
    export interface IController {
        idc: IdcController;
    }
}
