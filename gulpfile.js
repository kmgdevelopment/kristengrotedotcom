const { series, src, dest, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

const componentsDir = path.join(__dirname, 'src/components');
const indexScssPath = path.join(componentsDir, '_index.scss');

function updateComponentsIndex(done) {
    // This function recursively scans all subfolders in src/components for SCSS files
    // and automatically generates @forward statements in src/components/_index.scss.
    // This keeps _index.scss up to date for easy importing of all component styles.
    
    function findScssFiles(dir, relativePath = '') {
        let scssFiles = [];
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            
            entries.forEach(entry => {
                const fullPath = path.join(dir, entry.name);
                const relativeFilePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
                
                if (entry.isDirectory()) {
                    // Recursively search subdirectories
                    scssFiles = scssFiles.concat(findScssFiles(fullPath, relativeFilePath));
                } else if (entry.isFile() && entry.name.endsWith('.scss') && entry.name !== '_index.scss') {
                    // Add SCSS files (excluding _index.scss to avoid self-reference)
                    scssFiles.push(relativeFilePath);
                }
            });
        } catch (err) {
            console.error(`Error reading directory ${dir}:`, err);
        }
        
        return scssFiles;
    }
    
    try {
        const scssFiles = findScssFiles(componentsDir);
        // Generate @forward statements for each SCSS file found
        const forwards = scssFiles.map(f => `@forward './${f.replace('.scss', '')}';`).join('\n');
        // Write the @forward statements to _index.scss
        fs.writeFile(indexScssPath, forwards + '\n', done);
    } catch (err) {
        done(err);
    }
}

const compileSass = () => {
    return src('./src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                style: 'compressed',
                loadPaths: [
                    'node_modules',
                    'src/sass'
                ]
            }).on('error', sass.logError)
        )
        .pipe(sourcemaps.write('.'))
        .pipe(
            dest('./dist/assets/css')
        )
        .pipe( 
            browserSync.stream() 
        );
}

const compileTs = () => {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/ts/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('main.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(dest('./dist/assets/js'))
    .pipe(browserSync.stream());
}

const syncBrowser = (done) => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        open: false
    });

    // Watch Sass files and inject CSS
    watch(['./src/sass/**/*.scss', './src/components/**/*.scss'], compileSass);

    // Watch TypeScript files and compile
    watch(['./src/**/*.ts'], compileTs);

    // Watch for new/removed SCSS files in subfolders of src/components and update _index.scss
    watch(['src/components/*/*.scss'], updateComponentsIndex);

    // Watch all HTML, JS, and CSS files in dist and reload browser on change
    watch(['dist/**/*.html', 'dist/**/*.js', 'dist/**/*.css']).on('change', browserSync.reload);
    
    done();
}


exports.compileTs = compileTs;
exports.compileSass = compileSass;
exports.updateComponentsIndex = updateComponentsIndex;
exports.syncBrowser = syncBrowser;

exports.default = series(updateComponentsIndex, compileTs, syncBrowser);
