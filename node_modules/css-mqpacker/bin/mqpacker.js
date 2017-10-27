#!/usr/bin/env node

"use strict";

const mqpacker = require("../index");
const fs = require("fs");
const minimist = require("minimist");
const pkg = require("../package.json");

const argv = minimist(process.argv.slice(2), {
  boolean: [
    "help",
    "sort",
    "sourcemap",
    "version"
  ],
  alias: {
    "h": "help",
    "s": "sort"
  },
  default: {
    "help": false,
    "sourcemap": false,
    "sort": false,
    "version": false
  }
});
const binname = Object.keys(pkg.bin)[0];
const options = {};

function showHelp() {
  console.log(`Usage: ${binname} [options] INPUT [OUTPUT]

Description:
  ${pkg.description}

Options:
  -s, --sort       Sort “min-width” queries.
      --sourcemap  Create source map file.
  -h, --help       Show this message.
      --version    Print version information.

Use a single dash for INPUT to read CSS from standard input.

Examples:
  $ ${binname} fragmented.css
  $ ${binname} fragmented.css > packed.css`);

  return;
}

function pack(s, o) {
  mqpacker.pack(s, o)
    .then((result) => {
      if (!o.to) {
        process.stdout.write(result.css);

        return;
      }

      fs.writeFileSync(o.to, result.css);

      if (result.map) {
        fs.writeFileSync(`${o.to}.map`, result.map);
      }
    })
    .catch((error) => {
      if (error.name === "CssSyntaxError") {
        console.error(
          `${error.file}:${error.line}:${error.column}: ${error.reason}`
        );
        process.exit(1);
      }

      throw error;
    });
}

if (argv._.length < 1) {
  argv.help = true;
}

switch (true) {
case argv.version:
  console.log(`${binname} v${pkg.version}`);

  break;

case argv.help:
  showHelp();

  break;

default:
  if (argv.sort) {
    options.sort = true;
  }

  if (argv.sourcemap) {
    options.map = true;
  }

  options.from = argv._[0];

  if (argv._[1]) {
    options.to = argv._[1];
  }

  if (options.map && options.to) {
    options.map = {
      inline: false
    };
  }

  if (options.from === "-") {
    delete options.from;
    argv._[0] = process.stdin.fd;
  }

  pack(fs.readFileSync(argv._[0], "utf8"), options);
}
