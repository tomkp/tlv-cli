'use strict';
const meow = require('meow');
const logSymbols = require('log-symbols');
const chalk = require('chalk');
const tlv = require('tlv');
const hexify = require('hexify');


function leftpad (str, len, ch) {
    str = String(str);
    var i = -1;
    if (!ch && ch !== 0) ch = ' ';
    len = len - str.length;
    while (++i < len) {
        str = ch + str;
    }
    return str;
}


const cli = meow(`
	Usage
	  $ npm-name <name>
	Examples
	  $ npm-name chalk
	  ${logSymbols.error} ${chalk.bold('chalk')} is unavailable
	  $ npm-name unicorn-cake
	  ${logSymbols.success} ${chalk.bold('unicorn-cake')} is available
	Exits with code 0 when the name is available or 2 when taken
`, {
    string: ['_']
});

const input = cli.input[0];

if (!input) {
    console.error('TLV required');
    process.exit(1);
}

const bytes = hexify.toByteArray(input)
var parsedTlv = tlv.parse(new Buffer(bytes));

function formatValue(value) {
    const ascii = chalk.green(value.toString());
    const hex = chalk.cyan(value.toString('hex'));
    return `${hex} ${ascii}`;
}

function format(tlv, index) {
    index++;
    const tabs = Array(index).join('   ');
    if (tlv.constructed) {
        const tagOut = chalk.red(tlv.tag.toString('16'))
        const lengthOut = chalk.blue(tlv.originalLength)
        console.log(`${tabs} ${tagOut} ${lengthOut}`)
        const arr = tlv.value;
        arr.map(function(child) {
            format(child, index);
        });
    } else {
        const tagOut = chalk.red(tlv.tag.toString('16'))
        const lengthOut = chalk.blue(tlv.originalLength)
        var valueOut = formatValue(tlv.value);
        console.log(`${tabs} ${tagOut} ${lengthOut} ${valueOut}`)
    }
}

format(parsedTlv, 0);
//console.log(chalk.blue(parsedTlv));