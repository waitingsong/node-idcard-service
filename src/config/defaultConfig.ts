export interface IDefaultConfig {
    idc: {
        dllTxt: string;
        dllImage: string;
    };
    img: {
        width: number;
        height: number;
        avatarWidth: number;
        avatarHeight: number;
        avatarOffsetX: number;
        avatarOffsetY: number;
        baseImage: string;
        minTransparentValue: number[];   // R,G,B
        maxTransparentValue: number[];
        debug: boolean;
    };
}

export class DefaultConfig implements IDefaultConfig {
    idc = {
        dllTxt: 'c:/sdtapi.dll',
        dllImage: 'c:/wltrs.dll',
    };
    img = {
        width: 344,
        height: 435,
        avatarWidth: 102,
        avatarHeight: 126,
        avatarOffsetX: 213,
        avatarOffsetY: 38,
        baseImage: 'image/idcard-tpl.png',
        minTransparentValue: [254, 254, 254],   // R,G,B
        maxTransparentValue: [255, 255, 255],
        debug: false,     // true不关闭浏览器且显示合成图片效果
    };
}

export default new DefaultConfig();

declare module 'egg' {
    export interface Application {
        config: EggAppConfig & IDefaultConfig;
    }

    export interface AjaxResp {
        err: number;
        dat?: null | any;
        msg?: string | null;
    }

}
