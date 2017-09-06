import {Controller} from 'egg';
import * as fs from 'fs';
import * as path from 'path';

export default class ImgController extends Controller {
    public read(): void {
        const {ctx, app} = this;
        let filename: string;

        try {
            filename = decodeURIComponent(ctx.params.filename);
        }
        catch(ex) {
            ctx.logger.error(ex);
            ctx.status = 500;
            return;
        }
        const data = app.idinfoMap.get(filename);

        if ( ! data) {
            ctx.status = 404;
            ctx.logger.error('/read_img file not exists:' + filename);
            return;
        }
        ctx.logger.info('read_image() data', data.imagePath);

        ctx.status = 200;
        ctx.body = fs.createReadStream(data.imagePath);
    }

}


declare module 'egg' {
    export interface IController {
        img: ImgController;
    }
}
