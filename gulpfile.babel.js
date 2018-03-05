/*  Load plugins
    ************************* */
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import del from 'del';
import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import minifycss from 'gulp-clean-css';
import { output as pagespeed } from 'psi';
import runSequence from 'run-sequence';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import realFavicon from 'gulp-real-favicon';
import fs from 'fs';

// File where the favicon markups are stored
const FAVICON_DATA_FILE = 'faviconData.json';
const reload = browserSync.reload;

gulp.task('generate-favicon', done => {
	realFavicon.generateFavicon(
		{
			masterPicture: 'src/assets/img/logos/aapa-purple.svg',
			dest: 'src',
			iconsPath: './',
			design: {
				ios: {
					pictureAspect: 'backgroundAndMargin',
					backgroundColor: '#f58220',
					margin: '14%',
					assets: {
						ios6AndPriorIcons: false,
						ios7AndLaterIcons: false,
						precomposedIcons: false,
						declareOnlyDefaultIcon: true,
					},
				},
				desktopBrowser: {},
				windows: {
					pictureAspect: 'noChange',
					backgroundColor: '#f58220',
					onConflict: 'override',
					assets: {
						windows80Ie10Tile: false,
						windows10Ie11EdgeTiles: {
							small: false,
							medium: true,
							big: false,
							rectangle: false,
						},
					},
				},
				androidChrome: {
					pictureAspect: 'backgroundAndMargin',
					margin: '17%',
					backgroundColor: '#f58220',
					themeColor: '#f58220',
					manifest: {
						display: 'standalone',
						orientation: 'notSet',
						onConflict: 'override',
						declared: true,
					},
					assets: {
						legacyIcon: false,
						lowResolutionIcons: false,
					},
				},
				safariPinnedTab: {
					pictureAspect: 'silhouette',
					themeColor: '#f58220',
				},
			},
			settings: {
				scalingAlgorithm: 'Mitchell',
				errorOnImageTooSmall: false,
				readmeFile: false,
				htmlCodeFile: false,
				usePathAsIs: false,
			},
			markupFile: FAVICON_DATA_FILE,
		},
		() => {
			done();
		}
	);
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', () =>
	gulp
		.src(['src/*.html'])
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(gulp.dest('src'))
);

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', done => {
	const currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
	realFavicon.checkForUpdates(currentVersion, err => {
		if (err) {
			throw err;
		}
	});
});

/*  Clean the /docs directory (gulp clean)
  ************************* */
gulp.task('clean', () => del(['docs']));

/*  Copy specific files to docs (gulp copy)
  - eg. fonts, server config etc
  ************************* */
gulp.task('copy', () => {
	// Server config
	gulp.src(['src/.htaccess', 'src/*']).pipe(gulp.dest('docs'));
});

/*  Optimize Images (gulp images)
  - Optimizes images and outputs to docs directory
  ************************* */
gulp.task('images', () =>
	gulp
		.src('src/assets/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('docs/assets/img'))
);

/*  Styles (gulp styles)
  - Pre-Processes specific scss files into CSS
  - Minifies the CSS
  - Auto prefixes for vendor specificity
  - Generates source maps too
  ************************* */
gulp.task('styles', () =>
	gulp
		.src(['src/assets/scss/theme.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({ browsers: ['last 5 versions'] }))
		.pipe(minifycss())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('docs/assets/'))
		.pipe(reload({ stream: true }))
);

/*  Concat and Minify JS Dependencies (gulp js-dep)
  ************************* */
gulp.task('js-dep', () => {
	// Put any node_modules dependencies (JS) here
	const files = [
		// 'node_modules/jquery/docs/jquery.js',
		'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
		'node_modules/imagesloaded/imagesloaded.pkgd.js',
		'node_modules/owl.carousel/dist/owl.carousel.js',
		'node_modules/jquery-countto/jquery.countTo.js',
		'node_modules/echarts/dist/echarts-en.js',
		'node_modules/jquery.appear/jquery.appear.js',
	];

	return gulp
		.src(files)
		.pipe(concat('plugins.js'))
		.pipe(uglify())
		.pipe(gulp.dest('docs/assets/'));
});

/*  Concat and Minify Custom JS (gulp js)
  ************************* */
gulp.task('js', () =>
	gulp
		.src('src/assets/js/**/*.js')
		.pipe(concat('theme.js'))
		.pipe(babel())
		.pipe(uglify())
		.pipe(gulp.dest('docs/assets/'))
);

/*  Minify HTML (gulp html)
  ************************* */
gulp.task('html', () =>
	gulp
		.src('src/*.html')
		.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
		.pipe(gulp.dest('docs'))
);

/*  Initial Build (gulp initialBuild)
  - Runs the tasks in a specific order
  ************************* */
gulp.task('initialBuild', callback =>
	runSequence(
		'clean',
		'generate-favicon',
		'inject-favicon-markups',
		'copy',
		['images', 'styles', 'js-dep', 'js'],
		'html',
		callback
	)
);

/*  Default task (gulp)
  - Calls initialBuild task then:
  - Starts BrowserSync
  - Watches for any scss updates, and compiles the css
  ************************* */
gulp.task('default', ['initialBuild'], () => {
	/* Run task on updates */
	gulp.watch('src/**/*.html', ['inject-favicon-markups', 'html']);
	gulp.watch('src/assets/scss/**/*.scss', ['styles']);
	gulp.watch('src/assets/js/**/*.js', ['js']);
	gulp.watch('src/assets/img/**/*', ['images']);

	/* Start BrowserSync */
	const files = ['docs/**/*'];

	return browserSync.init(files, {
		server: { baseDir: './docs' }, // Use BrowserSync as server
		// proxy: '127.0.0.1:8060', // - OR - Proxy a web server
		port: 8080,
		open: true,
		notify: false,
	});
});

/*  Run PageSpeed Insights (gulp pagespeed)
  - By default we use the PageSpeed Insights free (no API key) tier.
  - Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
  ************************* */
gulp.task('pagespeed', cb =>
	// Update the below URL to the public URL of your site
	pagespeed(
		'your-pa-can.com',
		{
			strategy: 'mobile',
			// key: '',
		},
		cb
	)
);

/*  Deploy (gulp deploy)
  - Calls initialBuild task
  ************************* */
gulp.task('deploy', callback => runSequence('initialBuild', callback));
