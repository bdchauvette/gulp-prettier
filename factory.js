const PluginError = require("plugin-error");
const through = require("through2");

/** @type {{ name: string }} */
const pkg = require("./package.json");

/**
 * Creates a PluginError with the provided message
 *
 * @param {string} msg
 * @return {PluginError}
 */
const withError = msg => new PluginError(pkg.name, msg);

/**
 * Creats a Gulp plugin for formatting code with prettier
 *
 * @see https://github.com/prettier/prettier#options
 */
const pluginFactory = prettier => (options = {}) =>
  through.obj((file, encoding, done) => {
    if (file.isNull()) {
      return done(null, file);
    }

    if (file.isStream()) {
      return done(
        withError(
          "Streaming file contents not supported. Use vinyl-buffer or gulp-buffer before this plugin."
        )
      );
    }

    // Prettier can determine which parser to use based on the file path. This
    // is useful for e.g. formatting CSS or TypeScript files.
    options.filepath = file.path;

    const originalCode = file.contents.toString();

    try {
      const prettierCode = prettier.format(originalCode, options);

      file.didPrettierFormat = prettierCode !== originalCode;

      // Only need to create a new buffer if the code actually changed
      if (file.didPrettierFormat) {
        file.contents = new Buffer(prettierCode);
      }

      return done(null, file);
    } catch (err) {
      return done(withError(err));
    }
  });

module.exports = pluginFactory;
