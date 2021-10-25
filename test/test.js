'use strict';

require('mocha');

const toJs = require('../index');
const Vinyl = require('vinyl');
const assert = require('assert');

describe('transform html to js', () => {
    it('transforms the html files', done => {
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

describe('wraps js templates', () => {
    it('wraps template cache calls in an angular function', done => {
        const moduleName = 'moduleName' + Math.ceil(Math.random() * 100);
        const stream = toJs.wrap(moduleName);

        const originalContent = 't.put(\'/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');'
            + 't.put(\'/template-b.html\',\'<h1 id="template-b">I\\\'m template B!</h1>\');';
        const expected = `angular.module('${moduleName}').run(['$templateCache',function(t){\n${originalContent}\n}]);`;

        stream.on('data', function (file) {
            assert.strictEqual(file.relative, 'template.js');
            assert.strictEqual(file.contents.toString('utf8'), expected);
            done();
        });

        stream.write(new Vinyl({
            base: __dirname,
            path: __dirname + '/template.js',
            contents: Buffer.from(originalContent)
        }));
        stream.end();
    });
});