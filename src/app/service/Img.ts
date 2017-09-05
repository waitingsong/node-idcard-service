import {Context, Service} from 'egg';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as cidr from 'idcard-reader';
import * as path from 'path';


/**
 * Img Api Service
 */
export class Img extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }
    getConfig() {
        return this.app.config.img;
    }

    public readFile(file: string): fs.ReadStream {
        return fs.createReadStream(file);

    }

    public async composite(row: cidr.Config.IDData): Promise<string> {
        const {ctx} = this;
        const header = ctx.request.header;

        const file = row.imagePath;
        const name = path.basename(file);
        const dir = path.dirname(file);
        const processSettings = encodeURIComponent(JSON.stringify(this.getConfig()));

        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto(`http://${header.host}/public/img.html?st=${processSettings}#` + encodeURIComponent(name));

        return page.waitForSelector('#rinput')
            .then(() => {
                return page.$('#rinput');
            })
            .then((elm: any) => { // elementHandle
                if (elm) {
                    return page.evaluate(() => {
                        const input = <HTMLInputElement> document.querySelector('#rinput');

                        return input ? input.value : '';
                    });
                }
                else {
                    return '';
                }
            })
            .then(durl => {
                if (durl) {
                    ctx.logger.info('composite result url length:' + durl.length);
                }
                else {
                    ctx.logger.error('composite result url length 0');
                }
                browser.close();
                return durl ? durl : '';
            })
            .catch(err => {
                ctx.logger.error(err);
                browser.close();
                return '';
            });
    }


}

interface PWindow extends Window {
    run(file: string): any;
}

export default Img;

declare module 'egg' {
    export interface IService {
        img: Img;
    }
}
