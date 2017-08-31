import { Context, Service } from 'egg';
import * as idcr from 'idcard-reader';


/**
 * Idc Api Service
 */
export class Idc extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }
    getConfig() {
        return this.app.config.idc;
    }


    public getData(settings: idcr.Config.Init): Promise<idcr.Config.IDData | void> {
        return idcr.init(settings).then((inited): idcr.Config.Device[] | void => {
            if (!inited) {
                return;
            }
            const devices = idcr.find_device_list();

            if (devices.length) {
                return devices;
            }
            else {
                return;
            }
        })
            .then((devices): Promise<idcr.Config.IDData | void> => {
                return idcr.fetch_data(devices[0]).then(data => {
                    console.log(data);
                    return data;
                })
                .catch(() => {
                    return;
                });
            });
    }

}

export default Idc;

declare module 'egg' {
    export interface IService {
        idc: Idc;
    }
}
