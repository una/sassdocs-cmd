#! /usr/bin/env node

'use strict';

var program = require('commander');

var out_vars = 'Variables: $\n\nThe most straightforward way to use SassScript is to use variables. Variables begin with dollar signs, and are set like CSS properties:\n\n$width: 5em;\n\nYou can then refer to them in properties:\n\n#main {\n  width: $width;\n}';

var out_datatype = 'Data Types\n\nSassScript supports six main data types:\n\n- numbers (e.g. 1.2, 13, 10px)\n- strings of text, with and without quotes (e.g. \"foo\", \'bar\', baz)\n- colors (e.g. blue, #04a3f9, rgba(255, 0, 0, 0.5))\n- booleans (e.g. true, false)\n- nulls (e.g. null)\n- lists of values, separated by spaces or commas (e.g. 1.5em 1em 0 2em, Helvetica, Arial, sans-serif)\n- maps from one value to another (e.g. (key1: value1, key2: value2))\n\nSassScript also supports all other types of CSS property value, such as Unicode ranges and !important declarations. However, it has no special handling for these types. They are treated just like unquoted strings.';

program
  .version('0.0.1')
  .option('-t, --test', 'Make sure it works')
  .option('variables', 'What are variables')
  .parse(process.argv);

function readSassMe () {
	
// get the arguments, minus node
	var args = process.argv.slice(2);

	if (args == 'variables' || args == "vars") {
		console.log(out_vars);
	};

	if (args == 'datatypes' || args == "data-types") {
		console.log(out_datatype);
	};
		
};

readSassMe();