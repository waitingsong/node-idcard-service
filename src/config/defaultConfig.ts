export class DefaultConfig {
    idc = {
        dllTxt: 'c:/sdtapi.dll',
        dllImage: 'c:/wltrs.dll',
    };
    img = {
    };
};

export default new DefaultConfig();

declare module 'egg' {
    export interface Application {
        config: EggAppConfig & DefaultConfig;
    }
}
