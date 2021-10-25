#grunt-angular-templates-lite
Lightweight Gulp task to convert angular.js (v1) html templates to javascript that uses the template cache.

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
        .pipe(angularTemplatesLite()) // Convert each HTML file to a single line of javascript
        .pipe(concat('templates.js')) // Concatenate the lines of javascript to a single javascript file
        .pipe(angularTemplatesLite.wrap('plingApp')) // Wrap the lines of template javascript  
        .pipe(gulp.dest('.tmp/')); // Output the templates.js the specified directory
}
```