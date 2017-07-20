# gulp-prettier

> [Gulp][] plugin to format code with [prettier][]
>
> [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
> [![codecov](https://codecov.io/gh/bdchauvette/gulp-prettier/branch/master/graph/badge.svg)](https://codecov.io/gh/bdchauvette/gulp-prettier)
> [![Build Status](https://travis-ci.org/bdchauvette/gulp-prettier.svg?branch=master)](https://travis-ci.org/bdchauvette/gulp-prettier)
> [![dependencies Status](https://david-dm.org/bdchauvette/gulp-prettier/status.svg)](https://david-dm.org/bdchauvette/gulp-prettier)

[Gulp]: http://gulpjs.com/
[prettier]: https://github.com/prettier/prettier

## Installation

```
npm install --save-dev @bdchauvette/gulp-prettier
```

`prettier` is a peer dependency, so make sure to install it if it's not already in your `package.json`:

```sh
npm install --save-dev prettier
```

## Usage

```js
const gulp = require("gulp");
const prettier = require("@bdchauvette/gulp-prettier");

gulp.task("prettify", () =>
  gulp
    .src("src/**/*.js")
    .pipe(
      prettier({
        // Normal prettier options, e.g.:
        singleQuote: true,
        trailingComma: "all"
      })
    )
    .pipe(gulp.dest(file => file.base))
);
```

The plugin adds a boolean `didPrettierFormat` property to the Vinyl file
object. You can use this property to only output changed files, or fail CI
builds if any files were not changed (see recipes below).

### Options

For the available options, see the
[`prettier` documentation](https://github.com/prettier/prettier#options).

The only option that is not passed directly through to `prettier` is `filepath`.
This plugin overrides the `filepath` property to match the `path` property of
the Vinyl File object being formatted. This allows `prettier` to infer which
parser to use if you do not explicitly set the `parser` option.

For example, if you use `gulp.src('**/*.css')`, `prettier` will automatically
infer that it needs to use the `postcss` parser to format your stylesheets.

### Recipes

#### Only output changed files

If you only want to write files that have actually been changed, you can use
[`gulp-filter`][] to filter out files that were already correctly formatted.

```js
const gulp = require("gulp");
const filter = require("gulp-filter");
const prettier = require("@bdchauvette/gulp-prettier");

gulp.task("prettify", () =>
  gulp
    .src("src/**/*.js")
    .pipe(prettier())
    .pipe(filter(file => file.didPrettierFormat))
    .pipe(gulp.dest(file => file.base))
);
```

[`gulp-filter`]: https://www.npmjs.com/package/gulp-filter


#### Fail CI builds on unformatted files

In a CI environment, you might want to fail the build if you detect any files
that haven't been formatted by prettier. You can do this by using [`gulp-if`][] to pipe to [`gulp-error`][] if any files are freshly formatted (i.e. they have the `didPrettierFormat` property).

```js
const gulp = require("gulp");
const gulpError = require("gulp-error");
const gulpIf = require("gulp-if");
const isCI = require("is-ci");
const prettier = require("@bdchauvette/gulp-prettier");

gulp.task("prettify", () =>
  gulp
    .src("src/**/*.js")
    .pipe(prettier())
    .pipe(gulpIf(file => isCI && file.didPrettierFormat, gulpError()))
    .pipe(gulp.dest(file => file.base))
);
```

[`gulp-if`]: https://www.npmjs.com/package/gulp-if
[`gulp-error`]: https://www.npmjs.com/package/gulp-error

#### Custom `prettier` builds

If you would like to use a custom build of `prettier`, e.g.
[`prettier-miscellaneous`][], you can require
`@bdchauvette/gulp-prettier/factory`, then pass it your own version of
`prettier`:

```js
const gulp = require("gulp");
const customPrettier = require("prettier-miscellaneous");
const createGulpPrettier = require("@bdchauvette/gulp-prettier/factory");

const gulpPrettier = createGulpPrettier(customPrettier);

gulp.task("prettify", () =>
  gulp
    .src("src/**/*.js")
    .pipe(gulpPrettier({ singleQuote: true }))
    .pipe(gulp.dest(file => file.base))
);
```

[`prettier-miscellaneous`]: https://www.npmjs.com/package/prettier-miscellaneous

### Sourcemaps

`prettier` does not currently support sourcemaps, so neither does this
plugin.

See [#445][] and [#2073][] for discussion.

[#445]: https://github.com/prettier/prettier/issues/445
[#2073]: https://github.com/prettier/prettier/issues/2073

---

## Related projects

There are a few different projects that integrate `prettier` and `gulp`:

- [`gulp-prettier`](https://www.npmjs.com/package/gulp-prettier)
- [`gulp-nf-prettier`](https://www.npmjs.com/package/gulp-nf-prettier)
- [`gulp-prettier-plugin`](https://www.npmjs.com/package/gulp-prettier-plugin)

---

## Development

### Testing

```sh
npm test
```

### Linting

```sh
npm run lint
```

```sh
# With fixes
npm run lint:fix
```
