
import {Application} from 'egg';
import * as cidr from 'idcard-reader';

export default (app: Application) => {
  app.idinfoMap = new Map();
};

declare module 'egg' {
    export interface Application {
        idinfoMap: Map<string, cidr.Config.IDData>; // filename: IDData
    }
}
