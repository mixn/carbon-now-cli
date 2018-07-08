# [![Carbon CLI](static/banner.png)](https://github.com/mixn/carbon-now-cli)

> 🎨 Beautiful images of your code — from right inside your terminal.

[![Build Status](https://travis-ci.org/mixn/carbon-now-cli.svg?branch=master)](https://travis-ci.org/mixn/carbon-now-cli) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)[![License MIT](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/mixn/carbon-now-cli/blob/master/license)

## Description

[carbon.now.sh](https://carbon.now.sh/) by [@dawn_labs](https://twitter.com/dawn_labs) is a wonderful tool that let’s you generate beautiful images of your source code through a great UI, letting you customize aspects like fonts, themes, window controls and much more.

`carbon-now-cli` gives you the **full power of Carbon** — right at your fingertips, **inside the terminal**.

Generate beautiful images from a source file, or *sections of a source file*, by running a single command.

Want to customize **everything** before generating the image? Run it in ⚡️ **interactive mode** ⚡️. 😎

![Basic example](static/demo.gif)

## Features

- 🖼 Downloads the **real**, **high-quality** image (*no DOM screenshots*)
- ✨ Detects file type **automatically**
- 🗂 Supports **all** file extensions supported by [carbon.now.sh](https://carbon.now.sh) and [more](https://github.com/mixn/carbon-now-cli/blob/master/src/helpers/language-map.json)
- 🖱 Allows selective highlighting via `--start` and `--end`
- 🐶 Displays image directly in supported terminals
- ⏱ Reports each step and therefore *shortens the wait*
- 👀 Saves to given location or only opens in browser for manual finish
- 🌈 Supports saving as `.png` or `.svg` — just like Carbon
- ✅ Tested
- ⛏ Maintained

## Installation

```
$ npm i -g carbon-now-cli
```

## Usage

```
 $ carbon-now --help

 Beautiful images of your code — from right inside your terminal.

 Usage
   $ carbon-now [file]

 Options
   -s, --start          Starting line of [file]
   -e, --end            Ending line of [file]
   -i, --interactive    Interactive mode
   -l, --location       Screenshot save location, default: cwd
   -o, --open           Open in browser instead of saving
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

Result:

![Basic example](static/example-1.png)

#### Fully customized

```
 $ carbon-now unfold.js -i
```

Launches an interactive mode, prompting questions, allowing you to customize every aspect of Carbon, like syntax theme, font-family, padding, drop-shadow, etc.

Given this input…

![Example 2, Input](static/example-2-1.png)

…the result will look like so 😍:

![Example 2, Output](static/example-2-2.png)

If you’re not sure what each question, e.g. “Make squared image?”, refers to, just confirm by hitting **Enter** — they will default to sensible, nice-looking things.

If needed, you can always check the [default settings](https://github.com/mixn/carbon-now-cli/blob/master/src/helpers/default-settings.js).

#### Selective

```
 $ carbon-now unfold.js -s 3 -e 6
```

Reads and creates image only of line `3` to `6`, instead of the entire file. Will throw an error if `-s` > `-e`.

**Of course** selective mode can be combined with interactive mode, just with like any other option. 😊

Result (without interactive mode):

![Example 3](static/example-3.png)

#### Full Example

For demonstration purposes, here is an example using all options.

```
 $ carbon-now unfold.js -s 3 -e 6 -l ~/Desktop -i
```

This saves a beautiful image of lines `3` to `6` to `~/Desktop`, after accepting custom wishes via interactive mode.

If you’re not sure about how the image will turn out you can always use `-o` or `--open`.

```
 $ carbon-now unfold.js -s 3 -e 6 -i -o
```

This will open the image in the browser for final touches. 😌

## License

MIT © [Miloš Sutanovac](https://twitter.com/mixn)
