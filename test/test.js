'use strict';

require('mocha');

const toJs = require('../index');
const Vinyl = require('vinyl');
const assert = require('assert');

describe('transforms html to js', () => {
    it ('transforms the html files', done => {
        const stream = toJs();

        stream.on('data', function (file) {
            assert.strictEqual(file.relative, 'template-a.html');
            assert.strictEqual(file.contents.toString('utf8'), 't.put(\'/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');');
            done();
        });

        stream.write(new Vinyl({
            base: __dirname,
            path: __dirname + '/template-a.html',
            contents: Buffer.from('<h1 id="template-a">I\'m template A!</h1>')
        }));
        stream.end();
    });
});