#! /usr/bin/env node

'use strict';

var program = require('commander');

var error = "Ahh! We can't find that. Type sassme --help for a list of options!"

var out_vars = 'Variables: $\n\nThe most straightforward way to use SassScript is to use variables. Variables begin with dollar signs, and are set like CSS properties:\n\n$width: 5em;\n\nYou can then refer to them in properties:\n\n#main {\n  width: $width;\n}';

var out_datatype = 'Data Types\n\nSassScript supports six main data types:\n\n- numbers (e.g. 1.2, 13, 10px)\n- strings of text, with and without quotes (e.g. \"foo\", \'bar\', baz)\n- colors (e.g. blue, #04a3f9, rgba(255, 0, 0, 0.5))\n- booleans (e.g. true, false)\n- nulls (e.g. null)\n- lists of values, separated by spaces or commas (e.g. 1.5em 1em 0 2em, Helvetica, Arial, sans-serif)\n- maps from one value to another (e.g. (key1: value1, key2: value2))\n\nSassScript also supports all other types of CSS property value, such as Unicode ranges and !important declarations. However, it has no special handling for these types. They are treated just like unquoted strings.\n\n Search each individually.';

var out_string = 'Strings\n\nCSS specifies two kinds of strings: those with quotes, such as \"Lucida Grande\" or \'http://sass-lang.com\', and those without quotes, such as sans-serif or bold. SassScript recognizes both kinds, and in general if one kind of string is used in the Sass document, that kind of string will be used in the resulting CSS.\n\nThere is one exception to this, though: when using #{} interpolation, quoted strings are unquoted. This makes it easier to use e.g. selector names in mixins. For example:\n\n@mixin firefox-message($selector) {\n  body.firefox #{$selector}:before {\n    content: \"Hi, Firefox users!\";\n  }\n}\n\n@include firefox-message(\".header\");\nis compiled to:\n\nbody.firefox .header:before {\n  content: \"Hi, Firefox users!\"; }';

var out_list ='Lists\n\nLists are how Sass represents the values of CSS declarations like margin: 10px 15px 0 0 or font-face: Helvetica, Arial, sans-serif. Lists are just a series of other values, separated by either spaces or commas. In fact, individual values count as lists, too: they???re just lists with one item.\n\nOn their own, lists don???t do much, but the SassScript list functions make them useful. The nth function can access items in a list, the join function can join multiple lists together, and the append function can add items to lists. The @each directive can also add styles for each item in a list.\n\nIn addition to containing simple values, lists can contain other lists. For example, 1px 2px, 5px 6px is a two-item list containing the list 1px 2px and the list 5px 6px. If the inner lists have the same separator as the outer list, you???ll need to use parentheses to make it clear where the inner lists start and stop. For example, (1px 2px) (5px 6px) is also a two-item list containing the list 1px 2px and the list 5px 6px. The difference is that the outer list is space-separated, where before it was comma-separated.\n\nWhen lists are turned into plain CSS, Sass doesn???t add any parentheses, since CSS doesn???t understand them. That means that (1px 2px) (5px 6px) and 1px 2px 5px 6px will look the same when they become CSS. However, they aren???t the same when they???re Sass: the first is a list containing two lists, while the second is a list containing four numbers.\n\nLists can also have no items in them at all. These lists are represented as () (which is also an empty map). They can???t be output directly to CSS; if you try to do e.g. font-family: (), Sass will raise an error. If a list contains empty lists or null values, as in 1px 2px () 3px or 1px 2px null 3px, the empty lists and null values will be removed before the containing list is turned into CSS.\n\nComma-separated lists may have a trailing comma. This is especially useful because it allows you to represent a single-element list. For example, (1,) is a list containing 1 and (1 2 3,) is a comma-separated list containing a space-separated list containing 1, 2, and 3.';

var out_map = 'Maps\n\nMaps represent an association between keys and values, where keys are used to look up values. They make it easy to collect values into named groups and access those groups dynamically. They have no direct parallel in CSS, although they???re syntactically similar to media query expressions:\n\n$map: (key1: value1, key2: value2, key3: value3);\n\nUnlike lists, maps must always be surrounded by parentheses and must always be comma-separated. Both the keys and values in maps can be any SassScript object. A map may only have one value associated with a given key (although that value may be a list). A given value may be associated with many keys, though.\n\nLike lists, maps are mostly manipulated using SassScript functions. The map-get function looks up values in a map and the map-merge function adds values to a map. The @each directive can be used to add styles for each key/value pair in a map. The order of pairs in a map is always the same as when the map was created.\n\nMaps can also be used anywhere lists can. When used by a list function, a map is treated as a list of pairs. For example, (key1: value1, key2: value2) would be treated as the nested list key1 value1, key2 value2 by list functions. Lists cannot be treated as maps, though, with the exception of the empty list. () represents both a map with no key/value pairs and a list with no elements.\n\nNote that map keys can be any Sass data type (even another map) and the syntax for declaring a map allows arbitrary SassScript expressions that will be evaluated to determine the key.\n\nMaps cannot be converted to plain CSS. Using one as the value of a variable or an argument to a CSS function will cause an error. Use the inspect($value) function to produce an output string useful for debugging maps.\n';

var out_color = 'Colors\n\nAny CSS color expression returns a SassScript Color value. This includes a large number of named colors which are indistinguishable from unquoted strings.\n\nIn compressed output mode, Sass will output the smallest CSS representation of a color. For example, #FF0000 will output as red in compressed mode, but blanchedalmond will output as #FFEBCD.\n\nA common issue users encounter with named colors is that since Sass prefers the same output format as was typed in other output modes, a color interpolated into a selector becomes invalid syntax when compressed. To avoid this, always quote named colors if they are meant to be used in the construction of a selector.';

var out_operation = 'Operations\n\nAll types support equality operations (== and !=). In addition, each type has its own operations that it has special support for.\n\nMore options: \n -sassme number-operations \n-sassme color-operations\n-sassme boolean-operations\n -sassme list-operations\n -sassme string-operations\n ';

var out_numberoperation = 'Number Operations\n\nSassScript supports the standard arithmetic operations on numbers (addition +, subtraction -, multiplication *, division /, and modulo %). Sass math functions preserve units during arithmetic operations. This means that, just like in real life, you cannot work on numbers with incompatible units (such as adding a number with px and em) and two numbers with the same unit that are multiplied together will produce square units (10px * 10px == 100px * px). Be Aware that px * px is an invalid CSS unit and you will get an error from Sass for attempting to use invalid units in CSS.\n\nRelational operators (<, >, <=, >=) are also supported for numbers, and equality operators (==, !=) are supported for all types.\n\nDivision and /\n\nCSS allows / to appear in property values as a way of separating numbers. Since SassScript is an extension of the CSS property syntax, it must support this, while also allowing / to be used for division. This means that by default, if two numbers are separated by / in SassScript, then they will appear that way in the resulting CSS.\n\nHowever, there are three situations where the / will be interpreted as division. These cover the vast majority of cases where division is actually used. They are:\n\nIf the value, or any part of it, is stored in a variable or returned by a function.\nIf the value is surrounded by parentheses.\nIf the value is used as part of another arithmetic expression.\nFor example:\n\np {\n  font: 10px/8px;             // Plain CSS, no division\n  $width: 1000px;\n  width: $width/2;            // Uses a variable, does division\n  width: round(1.5)/2;        // Uses a function, does division\n  height: (500px/2);          // Uses parentheses, does division\n  margin-left: 5px + 8px/2px; // Uses +, does division\n}\nis compiled to:\n\np {\n  font: 10px/8px;\n  width: 500px;\n  height: 250px;\n  margin-left: 9px; }\n\nIf you want to use variables along with a plain CSS /, you can use #{} to insert them. For example:\n\np {\n  $font-size: 12px;\n  $line-height: 30px;\n  font: #{$font-size}/#{$line-height};\n}\nis compiled to:\n\np {\n  font: 12px/30px; }';

var out_coloroperation = 'Color Operations\n\nAll arithmetic operations are supported for color values, where they work piecewise. This means that the operation is performed on the red, green, and blue components in turn. For example:\n\np {\n  color: #010203 + #040506;\n}\ncomputes 01 + 04 = 05, 02 + 05 = 07, and 03 + 06 = 09, and is compiled to:\n\np {\n  color: #050709; }\nOften it???s more useful to use color functions than to try to use color arithmetic to achieve the same effect.\n\nArithmetic operations also work between numbers and colors, also piecewise. For example:\n\np {\n  color: #010203 * 2;\n}\ncomputes 01 * 2 = 02, 02 * 2 = 04, and 03 * 2 = 06, and is compiled to:\n\np {\n  color: #020406; }\nNote that colors with an alpha channel (those created with the rgba or hsla functions) must have the same alpha value in order for color arithmetic to be done with them. The arithmetic doesn???t affect the alpha value. For example:\n\np {\n  color: rgba(255, 0, 0, 0.75) + rgba(0, 255, 0, 0.75);\n}\nis compiled to:\n\np {\n  color: rgba(255, 255, 0, 0.75); }\nThe alpha channel of a color can be adjusted using the opacify and transparentize functions. For example:\n\n$translucent-red: rgba(255, 0, 0, 0.5);\np {\n  color: opacify($translucent-red, 0.3);\n  background-color: transparentize($translucent-red, 0.25);\n}\nis compiled to:\n\np {\n  color: rgba(255, 0, 0, 0.8);\n  background-color: rgba(255, 0, 0, 0.25); }\nIE filters require all colors include the alpha layer, and be in the strict format of #AABBCCDD. You can more easily convert the color using the ie_hex_str function. For example:\n\n$translucent-red: rgba(255, 0, 0, 0.5);\n$green: #00ff00;\ndiv {\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=\'false\', startColorstr=\'#{ie-hex-str($green)}\', endColorstr=\'#{ie-hex-str($translucent-red)}\');\n}\nis compiled to:\n\ndiv {\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=\'false\', startColorstr=#FF00FF00, endColorstr=#80FF0000);\n}\n';

var out_string_operation = 'String Operations\n\nThe + operation can be used to concatenate strings:\n\np {\n  cursor: e + -resize;\n}\nis compiled to:\n\np {\n  cursor: e-resize; }\nNote that if a quoted string is added to an unquoted string (that is, the quoted string is to the left of the +), the result is a quoted string. Likewise, if an unquoted string is added to a quoted string (the unquoted string is to the left of the +), the result is an unquoted string. For example:\n\np:before {\n  content: \"Foo \" + Bar;\n  font-family: sans- + \"serif\";\n}\nis compiled to:\n\np:before {\n  content: \"Foo Bar\";\n  font-family: sans-serif; }\nBy default, if two values are placed next to one another, they are concatenated with a space:\n\np {\n  margin: 3px + 4px auto;\n}\nis compiled to:\n\np {\n  margin: 7px auto; }\nWithin a string of text, #{} style interpolation can be used to place dynamic values within the string:\n\np:before {\n  content: \"I ate #{5 + 10} pies!\";\n}\nis compiled to:\n\np:before {\n  content: \"I ate 15 pies!\"; }\nNull values are treated as empty strings for string interpolation:\n\n$value: null;\np:before {\n  content: \"I ate #{$value} pies!\";\n}\nis compiled to:\n\np:before {\n  content: \"I ate  pies!\"; }';

var out_booleanoperation = 'Boolean Operations\n\nSassScript supports and, or, and not operators for boolean values.';

var out_listoperation = 'List Operations\n\nLists don\'t support any special operations. Instead, they???re manipulated using the list functions.';


program
  .version('0.0.1')
  .option('-t, --test', 'Make sure it works')
  .option('variables', 'What are variables')
  .option('datatypes', 'Overview of 6 Sass data types')
  .option('string', 'String data type')
  .option('list', 'List data type')
  .option('map', 'Map data type')
  .option('color', 'Color data type')
  .option('operation', 'Sass operations')
  .parse(process.argv);

function readSassMe () {
	
// get the arguments, minus node
	var args = process.argv.slice(2);

	if (args == 'variables' || args == "vars") {
		console.log(out_vars);
	}

	else if (args == 'datatypes' || args == "data-types") {
		console.log(out_datatype);
	}

	else if (args == 'string' || args == "strings") {
		console.log(out_string);
	}

	else if (args == 'map' || args == "maps") {
		console.log(out_map);
	}

	else if (args == 'list' || args == "lists") {
		console.log(out_list);
	}

	else if (args == 'color' || args == "colors") {
		console.log(out_color);
	}

	else if (args == 'operation' || args == "operations") {
		console.log(out_operation);
	}

	else if (args == 'number-operation' || args == "number-operations") {
		console.log(out_numberoperation);
	}

	else if (args == 'color-operation' || args == "color-operations") {
		console.log(out_coloroperation);
	}

	else if (args == 'string-operation' || args == "string-operations") {
		console.log(out_stringoperation);
	}

	else if (args == 'list-operation' || args == "list-operations") {
		console.log(out_listoperation);
	}

	else if (args == 'boolean-operation' || args == "boolean-operations" || args == "bool-operations" || args == "boolean-operation") {
		console.log(out_booleanoperation);
	}

	else {
		console.log(error);
	}
};

readSassMe();