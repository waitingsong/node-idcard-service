import {Application} from 'egg';


export default (app: Application) => {
    const controller = app.controller;

    app.redirect('/', '/read');
    app.get('/read', controller.idc.read);
    app.get('/read_img/:filename', controller.img.read);
};
