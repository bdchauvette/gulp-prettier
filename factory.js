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
    // is useful for e.g. formatting CSS files.
    options.filepath = file.path;

    const code = file.contents.toString();
    let prettierCode = null;

    try {
      prettierCode = prettier.format(code, options);
    } catch (err) {
      return done(withError(err));
    }

    file.contents = new Buffer(prettierCode);

    return done(null, file);
  });

module.exports = pluginFactory;
