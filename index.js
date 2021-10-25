'use strict';

const Transform = require('stream').Transform;
const PluginError = require('plugin-error');

const PLUGIN_NAME = 'gulp-angular-templates-lite';

module.exports = function () {
    const transformStream = new Transform({objectMode: true});

    transformStream._transform = function(file, encoding, callback) {
        if (!file) {
            // nothing to do
            return callback(null, file);
        }

        const path = file.history[0];

        if (!path.startsWith(file._base)) {
            throw new PluginError(PLUGIN_NAME, new Error('Unable to calculate relative path'));
        }

        const relativePath = path.substr(file._base.length);

        file._contents = Buffer.from(getJs(relativePath, file._contents.toString(encoding)), encoding);

        callback(null, file, encoding);
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

    transformStream._transform = function(file, encoding, callback) {
        if (!file) {
            // nothing to do
            return callback(null, file, encoding);
        }

        file._contents = Buffer.concat([
            Buffer.from(`angular.module('${moduleName}').run(['$templateCache',function(t){\n`, encoding),
            file._contents,
            Buffer.from('\n}]);', encoding)
        ]);

        callback(null, file, encoding);
    }

    return transformStream;
}
