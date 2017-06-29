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

## Usage

```js
const gulp = require('gulp');
const gulpPrettier = require('@bdchauvette/gulp-prettier');

gulp.task('prettify', () =>
  gulp.src('src/**/*.js')
    .pipe(gulpPrettier({
      // Prettier options, e.g.:
      singleQuote: true,
      trailingComma: 'all',
    }))
    .pipe(gulp.dest('src'));
);
```

### Options

For the available options, see the
[`prettier` documentation](https://github.com/prettier/prettier#options).

The only option that is not passed directly through to `prettier` is `filepath`.
This plugin overrides the `filepath` property to match the `path` property of
the Vinyl File object being formatted. This allows `prettier` to infer which
parser to use if you do not explicitly set the `parser` option.

For example, if you use `gulp.src('**/*.css')`, `prettier` will automatically
infer that it needs to use the `postcss` parser to format your stylesheets.

### Different versions of `prettier`

If you would like to use a different version of `prettier` than the one that
comes with this plugin, you can require `@bdchauvette/gulp-prettier/factory`,
then pass it your own version of `prettier`.

The plugin will then work like normal, only your code will be formatted with
the provided `prettier` instance.

```js
const gulp = require('gulp');
const customPrettier = require('prettier');
const createGulpPrettier = require('@bdchauvette/gulp-prettier/factory');

const gulpPrettier = createGulpPrettier(customPrettier);

gulp.task('prettify', () =>
  gulp.src('src/**/*.js')
    .pipe(gulpPrettier({ singleQuote: true }))
    .pipe(gulp.dest('src'));
);
```

### Sourcemaps

`prettier` does not currently support sourcemaps, and so neither does this
plugin.

See [#445][] and [#2073][] for discussion.

[#445]: https://github.com/prettier/prettier/issues/445
[#2073]: https://github.com/prettier/prettier/issues/2073

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
