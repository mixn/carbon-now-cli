# [![Carbon CLI](static/banner.png)](https://github.com/mixn/carbon-now-cli)

> 🎨 Beautiful images of your code — from right inside your terminal.

[![Build Status](https://badgen.net/travis/mixn/carbon-now-cli?icon=travis)](https://travis-ci.org/mixn/carbon-now-cli) [![XO code style](https://badgen.net/badge/code%20style/XO?color=cyan)](https://github.com/xojs/xo) [![Featured in awesome-nodejs](https://awesome.re/badge.svg)](https://github.com/sindresorhus/awesome-nodejs#command-line-apps) [![Twitter Follow](https://img.shields.io/twitter/follow/mixn.svg?style=social&label=Follow)](https://twitter.com/mixn) [![Maintenance](https://badgen.net/badge/Maintained%3F/Yes/green)](https://github.com/mixn/carbon-now-cli/graphs/commit-activity) [![MIT license](https://badgen.net/badge/License/MIT/blue)](https://github.com/mixn/carbon-now-cli/blob/master/license)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Presets](#presets)
- [License](#license)

## Description

[carbon.now.sh](https://carbon.now.sh/) by [@dawn_labs](https://twitter.com/dawn_labs) is a wonderful tool that lets you generate beautiful images of your source code through an intuitive UI, while letting you customize aspects like fonts, themes, window controls and much more.

`carbon-now-cli` gives you the **full power of Carbon** — right at your fingertips, **inside the terminal**.

Generate beautiful images from a source file, or *sections of a source file*, by running a single command.

Want to customize **everything** before generating the image? Run it in ⚡️ **interactive mode** ⚡️. 😎

![Basic example](static/demo.gif)

## Features

- 🖼 Downloads the **real**, **high-quality** image (*no DOM screenshots*)
- ✨ Detects file type **automatically**
- 🗂 Supports **all** file extensions supported by [carbon.now.sh](https://carbon.now.sh) and [more](https://github.com/mixn/carbon-now-cli/blob/master/src/helpers/language-map.json)
- ⚡️ [Interactive mode](#fully-customized) via `--interactive`
- 🎒 [Presets](#presets): save and reuse your favorite settings
- 🖱 [Selective highlighting](#selective) via `--start` and `--end`
- 📎 [Copies image to clipboard](#copying-to-clipboard) via `--copy` (**cross-OS** 😱)
- 📚 Accepts [file, `stdin` or clipboard content](#input-sources) as input
- 🐶 Displays image directly in supported terminals
- ⏱ Reports each step and therefore *shortens the wait*
- 👀 Saves to [given location](#full-example) or [only opens in browser](#full-example) for manual finish
- 🌈 Supports saving as `.png` or `.svg` — just like Carbon
- 📏 Supports `2x`, `4x` or `1x` resolutions — just like Carbon
- ✅ Tested
- ⛏ Maintained

## Installation

#### npm
```
npm i -g carbon-now-cli
```

#### yarn
```
yarn global add carbon-now-cli
```

#### npx
```
$ npx carbon-now-cli <file>
```

#### Requirements

![Minimum Node.js version](https://badgen.net/badge/node/%3E=8.3/green)

## Usage

```
$ carbon-now --help

Beautiful images of your code — from right inside your terminal.

Usage
  $ carbon-now <file>
  $ pbpaste | carbon-now
  $ carbon-now --from-clipboard

Options
  -s, --start          Starting line of <file>
  -e, --end            Ending line of <file>
  -i, --interactive    Interactive mode
  -l, --location       Image save location, default: cwd
  -t, --target         Image name, default: original-hash.{png|svg}
  -o, --open           Open in browser instead of saving
  -c, --copy           Copy image to clipboard
  -p, --preset         Use a saved preset
  -h, --headless       Use only non-experimental Puppeteer features
  --config             Use a different, local config (read-only)
  --from-clipboard     Read input from clipboard instead of file

Examples
  See: https://github.com/mixn/carbon-now-cli#examples
```

## Examples

Assuming you have a file `unfold.js` with this content

```javascript
// Example from https://carbon.now.sh/
const unfold = (f, seed) => {
  const go = (f, seed, acc) => {
    const res = f(seed)
    return res ? go(f, res[1], acc.concat([res[0]])) : acc
  }
  return go(f, seed, [])
};
```

and you’d like to make a beautiful image out of it. You could approach this in several ways.

#### Basic

```
$ carbon-now unfold.js
```

Takes the entire source of `unfold.js`, uses Carbon’s default settings and saves as `.png` into your `cwd`.

**Result**:

![Basic example](static/example-1.png)

**Note**: `carbon-now` will be smart enough to reuse your last used settings, instead of the default ones. 🤓

#### Fully customized

```
$ carbon-now unfold.js -i
```

Launches an interactive mode, prompting questions, allowing you to customize every aspect of Carbon, like syntax theme, font-family, padding, drop-shadow, etc.

Given this input…

![Example 2, Input](static/example-2-1.png)

…the result will look like so 😍:

![Example 2, Output](static/example-2-2.png)

If you’re not sure what each question, e.g. “Make squared image?”, refers to, just confirm by hitting **Enter** — it will default to a sensible, nice-looking thing.

If needed, you can always check the [default settings](https://github.com/mixn/carbon-now-cli/blob/master/src/helpers/default-settings.js).

#### Selective

```
$ carbon-now unfold.js -s 3 -e 6
```

Reads and creates an image based on lines `3` to `6`, instead of the entire file. Will throw an error if `-s` > `-e`.

Selective mode can of course be combined with interactive mode, just with like any other option. 😊

**Result**:

![Example 3](static/example-3.png)

**Note**: `carbon-now` will be smart enough to reuse your last used settings, instead of the default ones. 🤓

#### Copying to clipboard

![Copying to Clipboard](static/clipboard-demo.gif)

It is [sometimes desired to just put the image in the clipboard](https://github.com/mixn/carbon-now-cli/issues/3#issue-339776815), so that it can be instantly pasted into other apps (like Keynote 💻 or Twitter 🐦). This is what the `--copy`/`-c` flag is for.

```
$ carbon-now unfold.js -c
```

will copy the image to clipboard instead of downloading it to a given directory.

Please be aware that this requires some binaries to be present on certain OS.

##### Linux

[`xclip`](https://linux.die.net/man/1/xclip) is required. You can install it via

```
sudo apt-get install xclip
```

##### Windows

[`NirCmd`](http://www.nirsoft.net/utils/nircmd.html) is required. It can be installed via

```
choco install nircmd
```

Also make sure the `nircmd` command is globally accessible/inside your Windows directory.

#### Input Sources

You’ll sometimes find yourself in a situation where you’d like to create an image based on a piece of code, but don’t want to be creating a file for it first.

In addition to files, `carbon-now-cli` therefore also accepts input coming from `stdin` or the clipboard.

##### `stdin`

```
$ pbpaste | carbon-now
$ echo '<h1>Hi</h1>' | carbon-now
```

##### Clipboard

```
$ carbon-now --from-clipboard
```

#### Full Example

For demonstration purposes, here is an example using all options.

```
$ carbon-now unfold.js -s 3 -e 6 -l ~/Desktop -t example-23 -i
```

This saves a beautiful image of lines `3` to `6` to `~/Desktop/example-23.png`, after accepting custom wishes via interactive mode.

If you’re not sure how exactly the image will turn out, you can always use `-o` or `--open`.

```
$ carbon-now unfold.js -s 3 -e 6 -i -o
```

This will open the image in the browser for final touches, instead of saving it immediately. 😌

## Presets

#### About

The most requested feature after `carbon-now-cli`’s initial release has been the support for **reusable settings**, to not having to go through the entire process of answering all questions in interactive mode each time.

Presets are officially included as of `v1.1.0` of `carbon-now-cli`. 🎉

#### Creating a preset

However you use the `carbon-now` command, a `~/.carbon-now.json` file will be created for you. This is where all your presets and the settings of the last interactive run will live.

When running `carbon-now` with `-i`, you’ll be asked the following two questions last:

![Presets 1](static/presets-1.png)

Answering with yes and naming the preset (in this case `presentation`) will result in the preset being saved to `~/.carbon-now.json`. In this particular case, `~/.carbon-now.json` will look like so:

```
{
  "latest-preset": {
    "t": "base16-light",
    "bg": "none",
    "wt": "none",
    "wc": true,
    "fm": "Inconsolata",
    "fs": "18px",
    "ln": true,
    "ds": true,
    "dsyoff": "3px",
    "dsblur": "5px",
    "wa": true,
    "pv": "15px",
    "ph": "15px",
    "si": false,
    "wm": false,
    "es": "2x",
    "type": "png"
  },
  "presentation": {
    "t": "base16-light",
    "bg": "none",
    "wt": "none",
    "wc": true,
    "fm": "Inconsolata",
    "fs": "18px",
    "ln": true,
    "ds": true,
    "dsyoff": "3px",
    "dsblur": "5px",
    "wa": true,
    "pv": "15px",
    "ph": "15px",
    "si": false,
    "wm": false,
    "es": "2x",
    "type": "png"
  }
}
```

`latest-preset` will be overwritten after each interactive run. `presentation` is meant to stay until you eventually decide to delete it manually.

#### Using a saved preset

Reusing presets is as easy and straight-forward as:

```
carbon-now unfold.js -p <name-of-preset>
```

If a given preset or `~/.carbon-now.json` doesn’t exist, `carbon-now-cli` will fall back to the [default settings](https://github.com/mixn/carbon-now-cli/blob/master/src/helpers/default-settings.js).

Taken the `presentation` preset we have created above, this is all we have to do:

```
carbon-now unfold.js -p presentation
```

**Result**:

![Presets 1](static/presets-2.png)

#### Reusing the last used settings

*It just works!* ™ 🎉

Any time you use `-i`, `carbon-now-cli` will automatically reuse those settings for its next run.

So you can `carbon-now <file> -i` and `carbon-now <file>` from there on — the output will always look as pretty as the one where you’ve used `-i`. 😊

#### Local configs

It is possible to use local configuration files via the `--config` flag.

This is convenient if you’re using `carbon-now-cli` via a script and would like to share presets among the users of your project.

```
carbon-now unfold.js --config local-config.json -p dark
```

Local configs differ from `~/.carbon-now.json` in the sense that they behave in a **read-only** manner, hence:

1. `local-config.json` won’t be created if it doesn’t exist
2. `latest-preset` will not be written to `local-config.json`

## License

MIT © [Miloš Sutanovac](https://twitter.com/mixn)
