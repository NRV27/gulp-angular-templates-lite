'use strict';

const Transform = require('stream').Transform;
const PluginError = require('plugin-error');

const PLUGIN_NAME = 'gulp-angular-templates-lite';

module.exports = function () {
    const transformStream = new Transform({objectMode: true});

    transformStream._transform = function (file, encoding, callback) {
        if (!file) {
            return callback(null, file);
        }

        if (!file.relative) {
            return callback(new PluginError(PLUGIN_NAME, new Error('Relative path missing for file')));
        }

        file._contents = Buffer.from(getJs(file.relative, file._contents.toString(encoding)), encoding);

        callback(null, file);
    };

    function getJs (relativePath, html) {
        const jsString = html.replace(/\\/g, '\\\\')
            .replace(/'/g, '\\\'')
            .replace(/\r?\n/g, '\\n');

        return `t.put('${relativePath}','${jsString}');`;
    }

    return transformStream;
};

module.exports.wrap = function (moduleName) {
    const transformStream = new Transform({objectMode: true});

    transformStream._transform = function (file, encoding, callback) {
        if (!file) {
            return callback(null, file);
        }

        file._contents = Buffer.concat([
            Buffer.from(`angular.module('${moduleName}').run(['$templateCache',function(t){\n`, encoding),
            file._contents,
            Buffer.from('\n}]);', encoding)
        ]);

        callback(null, file);
    }

    return transformStream;
}
