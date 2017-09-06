import {AjaxResp, Controller} from 'egg';
import * as path from 'path';


export default class IdcController extends Controller {
    public async read() {
        const {ctx, app} = this;
        const resp: AjaxResp = {
            err: 0,
            dat: {
                info: '',
                composite: '',
            },
        };
        const data = await ctx.service.idc.getData(app.config.idc);

        if (data) {
            resp.dat.info = data;

            if (app.config.idc.dllImage && data.imagePath) {
                const key = path.basename(data.imagePath);

                app.idinfoMap.set(key, data);
                resp.dat.composite = await ctx.service.img.composite(data); // dataURL
                app.idinfoMap.delete(key);
            }
        }

        ctx.status = 201;
        ctx.body = resp;
    }
}

declare module 'egg' {
    export interface IController {
        idc: IdcController;
    }
}
