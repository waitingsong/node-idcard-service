import {Controller} from 'egg';
import * as path from 'path';


export default class IdcController extends Controller {
    public async read() {
        const {ctx, app} = this;
        const resp: any = {
            err: 0,
            dat: {
                idData: '',
                imgUrl: '',
            },
        };
        const data = await ctx.service.idc.getData(app.config.idc);

        if (data) {
            resp.dat.idData = data;

            if (app.config.idc.dllImage && data.imagePath) {
                const key = path.basename(data.imagePath);

                app.idinfoMap.set(key, data);
                resp.dat.imgUrl = await ctx.service.img.composite(data); // dataURL
                app.idinfoMap.delete(key);
            }
        }

        ctx.body = resp;
        ctx.status = 201;
    }
}

declare module 'egg' {
    export interface IController {
        idc: IdcController;
    }
}
