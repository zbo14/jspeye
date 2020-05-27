# jspeye

A command-line tool that identifies URLs and interesting assignments/expressions in JavaScript files

## Install

`npm i jspeye`

## Usage

```
Usage: jspeye [options] [command]

Options:
  -V, --version        output the version number
  -m, --margin <int>   number of characters to show before/after match (default: 30)
  -o, --output <file>  write prettified JS to file for further inspection
  -q, --quiet          don't print banner or info
  -h, --help           display help for command

Commands:
  file <filename>      examine JS in filesystem
  url [options] <url>  examine JS at URL endpoint
  help [command]       display help for command
```
