"use strict";

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const mqpacker = require("../index");

exports["Public API"] = (test) => {
  const input = `.foo {
  z-index: 0;
}

@media (min-width:1px) {
  .foo {
    z-index: 1;
  }
}
`;
  const expected = postcss().process(input).css;

  test.expect(2);
  test.strictEqual(
    postcss([mqpacker()]).process(input).css,
    expected
  );
  test.strictEqual(
    mqpacker.pack(input).css,
    expected
  );
  test.done();
};

exports["Option: PostCSS options"] = (test) => {
  const input = `.foo {
  z-index: 0;
}

@media (min-width:1px) {
  .foo {
    z-index: 1;
  }
}

/*# sourceMappingURL=from.css.map */
`;
  const opts = {
    from: "from.css",
    map: {
      inline: false
    }
  };
  const expected = postcss().process(input, opts);
  const processed = mqpacker.pack(input, opts);

  test.expect(2);
  test.strictEqual(
    processed.css,
    expected.css
  );
  test.deepEqual(
    processed.map,
    expected.map
  );
  test.done();
};

exports["Option: sort"] = (test) => {
  const expected = `.foo {
  z-index: 0;
}

@media (min-width: 1px) {
  .foo {
    z-index: 1;
  }
}

@media (min-width: 2px) {
  .foo {
    z-index: 2;
  }
}
`;
  const input = `.foo {
  z-index: 0;
}

@media (min-width: 2px) {
  .foo {
    z-index: 2;
  }
}

@media (min-width: 1px) {
  .foo {
    z-index: 1;
  }
}
`;
  const opts = {
    sort: true
  };

  test.expect(4);
  test.notStrictEqual(
    mqpacker.pack(input).css,
    expected
  );
  test.strictEqual(
    mqpacker.pack(input, opts).css,
    expected
  );
  test.notStrictEqual(
    postcss([mqpacker()]).process(input).css,
    postcss([mqpacker(opts)]).process(input).css
  );
  test.strictEqual(
    mqpacker.pack(input, {
      sort: function (c, d) {
        return c.localeCompare(d);
      }
    }).css,
    expected
  );
  test.done();
};

exports["Real CSS"] = (test) => {
  const testCases = fs.readdirSync(path.join(__dirname, "fixtures"));
  const loadExpected = (file) => {
    file = path.join(__dirname, "expected", file);

    return fs.readFileSync(file, "utf8");
  };
  const loadInput = (file) => {
    file = path.join(__dirname, "fixtures", file);

    return fs.readFileSync(file, "utf8");
  };

  test.expect(testCases.length);
  testCases.forEach((testCase) => {
    const opts = {
      sort: false
    };

    if (testCase.indexOf("sort_") === 0) {
      opts.sort = true;
    }

    test.strictEqual(
      mqpacker.pack(loadInput(testCase), opts).css,
      loadExpected(testCase),
      testCase
    );
  });
  test.done();
};
