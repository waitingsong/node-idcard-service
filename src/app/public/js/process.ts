// also in defaultConfig
export interface Settings {
    width: number;
    height: number;
    avatarWidth: number;
    avatarHeight: number;
    avatarOffsetX: number;
    avatarOffsetY: number;
    baseImage: string;
    minTransparentValue: [number, number, number];   // R,G,B
    maxTransparentValue: [number, number, number];
    debug: boolean;      // true不关闭浏览器且显示合成图片效果
}
let settings: Settings;
const aimg = <HTMLImageElement> document.createElement('img');
const bimg = <HTMLImageElement> document.createElement('img');


aimg.onload = () => {
    const cvs = create_base_canvas(bimg, settings.width, settings.height);
    const cvs2 = process_avatar(aimg, settings);

    merge_avatar(cvs, cvs2, settings);

    const durl = cvs.toDataURL('image/png');
    const input = <HTMLInputElement> document.createElement('input');

    input.id = 'rinput';
    input.value = durl;
    document.body.appendChild(input);

    if (settings.debug) {
        const merged = <HTMLImageElement> document.createElement('img');

        merged.src = durl;
        document.body.appendChild(merged);
    }
};

function merge_avatar(cvs, avatarImage, settings) {
    const ctx = cvs.getContext('2d');

    if ( ! ctx) {
        throw new Error('创建ctx失败');
    }

    ctx.drawImage(avatarImage, settings.avatarOffsetX, settings.avatarOffsetY);
    return cvs;
}

function create_base_canvas(bimg, width, height) {
    const cvs = create_canvas(width, height);
    const ctx = cvs.getContext('2d');

    if ( ! ctx) {
        throw new Error('创建ctx失败');
    }

    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(bimg, 0, 0);

    return cvs;
}

function create_canvas(width, height) {
    const cvs = document.createElement('canvas');

    cvs.width = width;
    cvs.height = height;

    return cvs;
}

function create_avatar_canvas(aimg, width, height) {
    const cvs = create_canvas(width, height);
    const ctx = cvs.getContext('2d');

    if ( ! ctx) {
        throw new Error('创建ctx失败');
    }

    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(aimg, 0, 0);

    return cvs;
}

function process_avatar(aimg, settings) {
    const cvs = create_avatar_canvas(aimg, settings.width, settings.height);
    const ctx = cvs.getContext('2d');

    if ( ! ctx) {
        throw new Error('创建ctx失败');
    }
    console.time('process_avatar');

    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(aimg, 0, 0);

    const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
    const data = imageData.data;
    const minTransparentValue = settings.minTransparentValue;
    const maxTransparentValue = settings.maxTransparentValue;


    // 对像素集合中的单个像素进行循环，每个像素是由4个通道组成，所以 i=i+4
    for (let i = 0, len = data.length; i < len; i += 4) {
        // 得到 RGBA 通道的值
        const rgb = data.slice(i, i + 4); // R,G,B

        for (let j = 0; j < 4; j++) {
            if (rgb[j] >= minTransparentValue[j] && rgb[j] <= maxTransparentValue[j]) {
                data[i+3] = 0;  // 设置透明
            }
        }
    }
    // 将修改后的代码复制回画布中
    ctx.putImageData(imageData, 0, 0);
    console.timeEnd('process_avatar');

    return cvs;
}

bimg.onload = () => {
    const file = location.hash;

    if (file && file.length > 1) {
        aimg.src = '/read_img/' + file.slice(1);
    }
    else {
        console.log('run() location.hash blank');
    }
};

export function run() {
    const arr = location.search;
    const search = decodeURIComponent(arr.split('=')[1]);

    try {
        settings = JSON.parse(search);
        console.log('setttt', settings);
    }
    catch(ex) {
        console.error(ex);
        return;
    }

    bimg.src = settings.baseImage;
}

