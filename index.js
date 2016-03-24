'use strict';
const meow = require('meow');
const chalk = require('chalk');
const tlv = require('tlv');
const hexify = require('hexify');



const cli = meow(``, {
    string: ['_']
});

const input = cli.input[0];

if (!input) {
    console.error('TLV required');
    process.exit(1);
}

const bytes = hexify.toByteArray(input);
const parsedTlv = tlv.parse(new Buffer(bytes));

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
function formatTag(tag) {
    return chalk.red(tag.toString('16'));
}
function formatLength(length) {
    return chalk.blue(leftpad(length, 2, '0'));
}
function formatValue(value) {
    const ascii = chalk.green.bgWhite(value.toString());
    const hex = chalk.magenta.bgWhite(value.toString('hex'));
    return `${hex} ${ascii}`;
}

function format(tlv, index) {
    index++;
    const tabs = new Array(index).join('   ');



    if (tlv.constructed) {
        const tagOut = formatTag(tlv.tag);
        const lengthOut = formatLength(tlv.originalLength);
        const arr = tlv.value;
        arr.map(function(child) {
            format(child, index);
        });
    } else {
        const tagOut = formatTag(tlv.tag);
        const lengthOut = formatLength(tlv.originalLength);
        var valueOut = formatValue(tlv.value);
        console.log(`${tabs} ${tagOut} ${lengthOut} ${valueOut}`)
    }
}

format(parsedTlv, 0);
