#!/usr/bin/env node
'use strict';
const meow = require('meow');

const cli = meow(`
	Usage
	  $ carbon-now-sh [input]

	Options
	  --file  Lorem ipsum [Default: false]

	Examples
	  $ carbon-now-sh
	  unicorns & rainbows
	  $ carbon-now-sh foobar.txt
	  ponies & rainbows
`)