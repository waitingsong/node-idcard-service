import {EggAppConfig} from 'egg';
// import * as fs from 'fs';
// import * as path from 'path';
import 'source-map-support/register';
import defaultConfig from './defaultConfig';

export default (appInfo: EggAppConfig) => {
    const config: any = {};

    // should change to your own
    config.keys = appInfo.name + '20170831';

    return {...config, ...defaultConfig};
};
