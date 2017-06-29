const File = require("vinyl");
const { join } = require("path");
const pEvent = require("p-event");
const PluginError = require("plugin-error");
const prettier = require("prettier");
const test = require("tape");
const toStream = require("string-to-stream");

const pkg = require("../package.json");
const gulpPrettier = require("..");
const gulpPrettierFactory = require("../factory");

const createFile = (filename, contents) =>
  new File({
    cwd: __dirname,
    base: join(__dirname, "fixture"),
    path: join(__dirname, "fixture", filename),
    contents
  });

// -----------------------------------------------------------------------------

test("Null file", t => {
  t.plan(2);

  const pluginStream = gulpPrettier({ semi: false });
  const data = pEvent(pluginStream, "data");

  const filename = "test-file.js";

  pluginStream.end(createFile(filename, null));

  data.then(file => {
    t.equal(file.relative, filename, "Should preserve filename");
    t.equal(file.contents, null, "Should pass through null files");
  });
});

// -----------------------------------------------------------------------------

test("Streamed file", t => {
  t.plan(3);

  const pluginStream = gulpPrettier();
  const data = pEvent(pluginStream, "data");

  const filename = "test-file.js";
  const code = "var foo";

  pluginStream.end(createFile(filename, toStream(code)));

  data.catch(err => {
    t.ok(err instanceof PluginError, "Should handle errors with PluginError");
    t.equal(err.plugin, pkg.name, "Should use correct plugin name");
    t.ok(
      /not supported/.test(err.message),
      "Should indicate streams not supported"
    );
  });
});

// -----------------------------------------------------------------------------

test("Buffered file", t => {
  t.plan(2);

  const pluginStream = gulpPrettier();
  const data = pEvent(pluginStream, "data");

  const filename = "test-file.js";
  const code = "var foo";
  const expectedCode = prettier.format(code);

  pluginStream.end(createFile(filename, Buffer.from(code)));

  data.then(file => {
    t.equal(file.relative, filename, "Should preserve filename");
    t.equal(file.contents.toString(), expectedCode, "Should format code");
  });
});

// -----------------------------------------------------------------------------

test("With options", t => {
  t.plan(2);

  const options = { semi: false };

  const pluginStream = gulpPrettier(options);
  const data = pEvent(pluginStream, "data");

  const filename = "test-file.js";
  const code = "var foo;";
  const expectedCode = prettier.format(code, options);

  pluginStream.end(createFile(filename, Buffer.from(code)));

  data.then(file => {
    t.equal(file.relative, filename, "Should preserve filename");
    t.equal(file.contents.toString(), expectedCode, "Should format code");
  });
});

// -----------------------------------------------------------------------------

test("CSS files", t => {
  t.plan(2);

  const pluginStream = gulpPrettier();
  const data = pEvent(pluginStream, "data");

  const filename = "test-file.css";
  const code = "div{color:red}";
  const expectedCode = prettier.format(code, { parser: "postcss" });

  pluginStream.end(createFile(filename, Buffer.from(code)));

  data.then(file => {
    t.equal(file.relative, filename, "Should preserve filename");
    t.equal(file.contents.toString(), expectedCode, "Should format code");
  });
});

// -----------------------------------------------------------------------------

test("Formatting errors", t => {
  t.plan(3);

  const pluginStream = gulpPrettier();
  const data = pEvent(pluginStream, "data");

  // Using CSS with a JS file should throw a SyntaxError
  const filename = "test-file.js";
  const code = "div{color:red}";

  pluginStream.end(createFile(filename, Buffer.from(code)));

  data.catch(err => {
    t.ok(err instanceof PluginError, "Should handle errors with PluginError");
    t.equal(err.plugin, pkg.name, "Should use correct plugin name");
    t.equal(err.name, "SyntaxError", "Should raise a SyntaxError");
  });
});

// -----------------------------------------------------------------------------

test("Custom prettier", t => {
  t.plan(3);

  const filename = "test-file.js";
  const code = "var foo";
  const expectedCode = "foobar";

  let didCallMock = false;

  const mockPrettier = {
    format() {
      didCallMock = true;
      return expectedCode;
    }
  };

  const customPlugin = gulpPrettierFactory(mockPrettier);
  const pluginStream = customPlugin();
  const data = pEvent(pluginStream, "data");

  pluginStream.end(createFile(filename, Buffer.from(code)));

  data.then(file => {
    t.equal(file.relative, filename, "Should preserve filename");
    t.ok(didCallMock, "Should call mocked prettier");
    t.equal(
      file.contents.toString(),
      expectedCode,
      "Should format code using custom mocked prettier"
    );
  });
});
