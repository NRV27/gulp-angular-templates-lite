# gulp-angular-templates-lite
Lightweight [Gulp](https://gulpjs.com) task to convert [AngularJS (v1)](https://angularjs.org) html templates to javascript that uses the template cache.

## Install
```
npm install gulp-angular-templates-lite --save-dev
```
## Usage

```javascript
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const angularTemplates = require('gulp-angular-templates-lite');
const concat = require('gulp-concat');

function buildTemplates () {
    return gulp.src('client/app/**/*.html')
        .pipe(htmlmin({}))  // Optional: miminize the HTML before converting to javascript
        .pipe(angularTemplates()) // Convert each HTML file to a single line of javascript
        .pipe(concat('templates.js')) // Concatenate the lines of javascript to a single javascript file
        .pipe(angularTemplates.wrap('myApp')) // Wrap the lines of template javascript using provided angular module name 
        .pipe(gulp.dest('.tmp/')); // Output the templates.js the specified directory
}
```