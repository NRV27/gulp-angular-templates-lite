'use strict';

const Transform = require('stream').Transform;
const PluginError = require('plugin-error');

const PLUGIN_NAME = 'gulp-angular-templates-lite';

module.exports = function () {
    const transformStream = new Transform({objectMode: true});

    /**
     * @param {Buffer|string} file
     * @param {string=} encoding - ignored if file contains a Buffer
     * @param {function(Error, object)} callback - Call this function (optionally with an
     *          error argument and data) when you are done processing the supplied chunk.
     */
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

        file._contents = Buffer.from(getJs(relativePath, file._contents.toString(encoding)));

        callback(null, file, encoding);
    };

    function getJs (relativePath, html) {
        return 'm.run([\'$templateCache\',function(t){t.put(\'' + relativePath + '\',\'' + toJsString(html) + '\')}]);';
    }

    function toJsString (html) {
        return html.replace(/\\/g, '\\\\')
            .replace(/'/g, '\\\'')
            .replace(/\r?\n/g, "\\n");
    }

    return transformStream;
};