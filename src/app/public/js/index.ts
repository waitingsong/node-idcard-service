/// <reference types="requirejs" />


requirejs.config(<RequireConfig>{
    baseUrl: 'js',
    paths:   {
        'process': 'process',
    },
});

requirejs(['process'], (p) => {
    p.run();
});
