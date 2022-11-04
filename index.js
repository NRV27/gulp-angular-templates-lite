'use strict';

/*
ISC License

Copyright 2021 Aaron Schinkowitch and contributors

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted,
provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
*/
const path = require('path');

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
        const formattedPath = relativePath.split(path.sep).join('/');
        const jsString = html.replace(/\\/g, '\\\\')
            .replace(/'/g, '\\\'')
            .replace(/\r?\n/g, '\\n');

        return `t.put('${formattedPath}','${jsString}');`;
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
