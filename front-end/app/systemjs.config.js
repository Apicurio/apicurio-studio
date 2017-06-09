/**
 * Systemjs configuration for Apicurio Studio
 */
(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'npm:': 'node_modules/'
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            studio: 'studio',
            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            // OAI library
            'oai-ts-core': 'npm:oai-ts-core/bundles/OAI.umd.js',
            // YAMLjs library
            'yamljs': 'npm:yamljs',
            // NG2 Bootstrap
            'ng2-bootstrap': 'node_modules/ng2-bootstrap',
            // NG2 ACE Editor
            'ng2-ace-editor': 'npm:ng2-ace-editor',
            'brace': 'npm:brace',
            'w3c-blob': 'npm:w3c-blob/index.js',
            'buffer': 'npm:buffer/index.js',
            'base64-js': 'npm:base64-js/index.js',
            'ieee754': 'npm:ieee754/index.js',
            // Angular Deps
            'rxjs': 'npm:rxjs',
            'angular2-in-memory-web-api': 'npm:angular2-in-memory-web-api',
            'core-js-shim': 'npm:core-js/client/shim.min.js',
            'zone': 'npm:zone.js/dist/zone.js',
            'reflect': 'npm:reflect-metadata/Reflect.js'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            studio: {
                main: './main.js',
                defaultExtension: 'js'
            },
            yamljs: {
                main: 'dist/yaml.min.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
            'ng2-bootstrap': {
                format: 'cjs',
                main: 'bundles/ng2-bootstrap.umd.js',
                defaultExtension: 'js'
            },
            'ng2-ace-editor': {
                main: 'ng2-ace-editor',
                defaultExtension: 'js'
            },
            'brace': {
                main: 'index',
                defaultExtension: 'js'
            },
            'angular2-in-memory-web-api': {
                main: './index.js',
                defaultExtension: 'js'
            }
        }
    });
})(this);
