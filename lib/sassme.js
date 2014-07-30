#! /usr/bin/env node

'use strict';

var program = require('commander');

var error = '\nUh Oh! We cant find that. Type sassme --help for a list of options!\n';

var out_nesting = 'Simple Nesting Example:\n--------------------------------------------------------\n.green {\n  color: #bada55 ;\n  .yellow-bg {\n    background: yellow;\n  }\n}\n--------------------------------------------------------\n\ncompiles to:\n--------------------------------------------------------\n.green {\n  color: #bada55;\n}\n.green .yellow-bg {\n  background: yellow;\n}\n--------------------------------------------------------\n\n for more, try sassme nested-properties or sassme nested-rules?';

var out_nestedprops = 'Nested Properties\n\nCSS has quite a few properties that are in \u201cnamespaces;\u201d for instance, font-family, font-size, and font-weight are all in the font namespace. In CSS, if you want to set a bunch of properties in the same namespace, you have to type it out each time. Sass provides a shortcut for this: just write the namespace once, then nest each of the sub-properties within it. For example:\n--------------------------------------------------------\n.funky {\n  font: {\n    family: fantasy;\n    size: 30em;\n    weight: bold;\n  }\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\n.funky {\n  font-family: fantasy;\n  font-size: 30em;\n  font-weight: bold; }\n--------------------------------------------------------\n\nThe property namespace itself can also have a value. For example:\n--------------------------------------------------------\n.funky {\n  font: 2px/3px {\n    family: fantasy;\n    size: 30em;\n    weight: bold;\n  }\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\n.funky {\n  font: 2px/3px;\n    font-family: fantasy;\n    font-size: 30em;\n    font-weight: bold; }\n--------------------------------------------------------';

var out_nestedrules = 'Nested Rules\n\nSass allows CSS rules to be nested within one another. The inner rule then only applies within the outer rule\u2019s selector. For example:\n--------------------------------------------------------\n#main p {\n  color: #00ff00;\n  width: 97%;\n\n  .redbox {\n    background-color: #ff0000;\n    color: #000000;\n  }\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\n#main p {\n  color: #00ff00;\n  width: 97%; }\n  #main p .redbox {\n    background-color: #ff0000;\n    color: #000000; }\n--------------------------------------------------------\n\nThis helps avoid repetition of parent selectors, and makes complex CSS layouts with lots of nested selectors much simpler. For example:\n\n--------------------------------------------------------\n#main {\n  width: 97%;\n\n  p, div {\n    font-size: 2em;\n    a { font-weight: bold; }\n  }\n\n  pre { font-size: 3em; }\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\n#main {\n  width: 97%; }\n  #main p, #main div {\n    font-size: 2em; }\n    #main p a, #main div a {\n      font-weight: bold; }\n  #main pre {\n    font-size: 3em; }\n--------------------------------------------------------';

var out_placeholders = 'Placeholder Selectors: %foo\n\nSass supports a special type of selector called a \u201cplaceholder selector\u201d. These look like class and id selectors, except the # or . is replaced by %. They\u2019re meant to be used with the @extend directive; for more information see @extend-Only Selectors.\n\nOn their own, without any use of @extend, rulesets that use placeholder selectors will not be rendered to CSS.';

var out_parent = 'Referencing Parent Selectors: &\n\nSometimes it\u2019s useful to use a nested rule\u2019s parent selector in other ways than the default. For instance, you might want to have special styles for when that selector is hovered over or for when the body element has a certain class. In these cases, you can explicitly specify where the parent selector should be inserted using the & character. \nFor example:\n--------------------------------------------------------\na {\n  font-weight: bold;\n  text-decoration: none;\n  &:hover { text-decoration: underline; }\n  body.firefox & { font-weight: normal; }\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\na {\n  font-weight: bold;\n  text-decoration: none; }\n  a:hover {\n    text-decoration: underline; }\n  body.firefox a {\n    font-weight: normal; }\n--------------------------------------------------------\n\n& will be replaced with the parent selector as it appears in the CSS. This means that if you have a deeply nested rule, the parent selector will be fully resolved before the & is replaced. \n\nFor example:\n--------------------------------------------------------\n#main {\n  color: black;\n  a {\n    font-weight: bold;\n    &:hover { color: red; }\n  }\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\n#main {\n  color: black; }\n  #main a {\n    font-weight: bold; }\n    #main a:hover {\n      color: red; }\n--------------------------------------------------------\n\n& must appear at the beginning of a compound selector, but it can be followed by a suffix that will be added to the parent selector. \nFor example:\n--------------------------------------------------------\n#main {\n  color: black;\n  &-sidebar { border: 1px solid; }\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\n#main {\n  color: black; }\n  #main-sidebar {\n    border: 1px solid; }\n--------------------------------------------------------\n\nIf the parent selector can\u2019t have a suffix applied, Sass will throw an error.\n\n';

var out_comments = 'Comments: /* */ and //\n\nSass supports standard multiline CSS comments with /* */, as well as single-line comments with //. The multiline comments are preserved in the CSS output where possible, while the single-line comments are removed. \nFor example:\n--------------------------------------------------------\n/* This comment is\n * several lines long.\n * since it uses the CSS comment syntax,\n * it will appear in the CSS output. */\nbody { color: black; }\n\n// These comments are only one line long each.\n// They won\'t appear in the CSS output,\n// since they use the single-line comment syntax.\na { color: green; }\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\n/* This comment is\n * several lines long.\n * since it uses the CSS comment syntax,\n * it will appear in the CSS output. */\nbody {\n  color: black; }\n\na {\n  color: green; }\n--------------------------------------------------------\n\nWhen the first letter of a comment is !, the comment will be interpolated and always rendered into css output even in compressed output modes. This is useful for adding Copyright notices to your generated CSS.';

var out_vars = 'Variables: $\n\nThe most straightforward way to use SassScript is to use variables. Variables begin with dollar signs, and are set like CSS properties:\n\n$width: 5em;\n\nYou can then refer to them in properties:\n\n#main {\n  width: $width;\n}';

var out_datatype = 'Data Types\n\nSassScript supports six main data types:\n\n- numbers (e.g. 1.2, 13, 10px)\n- strings of text, with and without quotes (e.g. \"foo\", \'bar\', baz)\n- colors (e.g. blue, #04a3f9, rgba(255, 0, 0, 0.5))\n- booleans (e.g. true, false)\n- nulls (e.g. null)\n- lists of values, separated by spaces or commas (e.g. 1.5em 1em 0 2em, Helvetica, Arial, sans-serif)\n- maps from one value to another (e.g. (key1: value1, key2: value2))\n\nSassScript also supports all other types of CSS property value, such as Unicode ranges and !important declarations. However, it has no special handling for these types. They are treated just like unquoted strings.\n\n Search each individually.';

var out_string = 'Strings\n\nCSS specifies two kinds of strings: those with quotes, such as \"Lucida Grande\" or \'http://sass-lang.com\', and those without quotes, such as sans-serif or bold. SassScript recognizes both kinds, and in general if one kind of string is used in the Sass document, that kind of string will be used in the resulting CSS.\n\nThere is one exception to this, though: when using #{} interpolation, quoted strings are unquoted. This makes it easier to use e.g. selector names in mixins.\n\n For example:\n--------------------------------------------------------\n@mixin firefox-message($selector) {\n  body.firefox #{$selector}:before {\n    content: \"Hi, Firefox users!\";\n  }\n}\n\n@include firefox-message(\".header\");\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\nbody.firefox .header:before {\n  content: \"Hi, Firefox users!\"; }\n--------------------------------------------------------\n';

var out_list ='Lists\n\nLists are how Sass represents the values of CSS declarations like margin: 10px 15px 0 0 or font-face: Helvetica, Arial, sans-serif. Lists are just a series of other values, separated by either spaces or commas. In fact, individual values count as lists, too: theyre just lists with one item.\n\nOn their own, lists don???t do much, but the SassScript list functions make them useful. The nth function can access items in a list, the join function can join multiple lists together, and the append function can add items to lists. The @each directive can also add styles for each item in a list.\n\nIn addition to containing simple values, lists can contain other lists. For example, 1px 2px, 5px 6px is a two-item list containing the list 1px 2px and the list 5px 6px. If the inner lists have the same separator as the outer list, you???ll need to use parentheses to make it clear where the inner lists start and stop. For example, (1px 2px) (5px 6px) is also a two-item list containing the list 1px 2px and the list 5px 6px. The difference is that the outer list is space-separated, where before it was comma-separated.\n\nWhen lists are turned into plain CSS, Sass doesn???t add any parentheses, since CSS doesn???t understand them. That means that (1px 2px) (5px 6px) and 1px 2px 5px 6px will look the same when they become CSS. However, they aren???t the same when they???re Sass: the first is a list containing two lists, while the second is a list containing four numbers.\n\nLists can also have no items in them at all. These lists are represented as () (which is also an empty map). They can???t be output directly to CSS; if you try to do e.g. font-family: (), Sass will raise an error. If a list contains empty lists or null values, as in 1px 2px () 3px or 1px 2px null 3px, the empty lists and null values will be removed before the containing list is turned into CSS.\n\nComma-separated lists may have a trailing comma. This is especially useful because it allows you to represent a single-element list. For example, (1,) is a list containing 1 and (1 2 3,) is a comma-separated list containing a space-separated list containing 1, 2, and 3.';

var out_map = 'Maps\n\nMaps represent an association between keys and values, where keys are used to look up values. They make it easy to collect values into named groups and access those groups dynamically. They have no direct parallel in CSS, although they???re syntactically similar to media query expressions:\n\n--------------------------------------------------------\n$map: (key1: value1, key2: value2, key3: value3);\n--------------------------------------------------------\n\nUnlike lists, maps must always be surrounded by parentheses and must always be comma-separated. Both the keys and values in maps can be any SassScript object. A map may only have one value associated with a given key (although that value may be a list). A given value may be associated with many keys, though.\n\nLike lists, maps are mostly manipulated using SassScript functions. The map-get function looks up values in a map and the map-merge function adds values to a map. The @each directive can be used to add styles for each key/value pair in a map. The order of pairs in a map is always the same as when the map was created.\n\nMaps can also be used anywhere lists can. When used by a list function, a map is treated as a list of pairs. \n\nFor example, (key1: value1, key2: value2) would be treated as the nested list key1 value1, key2 value2 by list functions. Lists cannot be treated as maps, though, with the exception of the empty list. () represents both a map with no key/value pairs and a list with no elements.\n\nNote that map keys can be any Sass data type (even another map) and the syntax for declaring a map allows arbitrary SassScript expressions that will be evaluated to determine the key.\n\nMaps cannot be converted to plain CSS. Using one as the value of a variable or an argument to a CSS function will cause an error. Use the inspect($value) function to produce an output string useful for debugging maps.\n';

var out_color = 'Colors\n\nAny CSS color expression returns a SassScript Color value. This includes a large number of named colors which are indistinguishable from unquoted strings.\n\nIn compressed output mode, Sass will output the smallest CSS representation of a color. For example, #FF0000 will output as red in compressed mode, but blanchedalmond will output as #FFEBCD.\n\nA common issue users encounter with named colors is that since Sass prefers the same output format as was typed in other output modes, a color interpolated into a selector becomes invalid syntax when compressed. To avoid this, always quote named colors if they are meant to be used in the construction of a selector.';

var out_operation = 'Operations\n\nAll types support equality operations (== and !=). In addition, each type has its own operations that it has special support for.\n\nMore options:\n-sassme number-operations\n-sassme color-operations\n-sassme boolean-operations\n-sassme list-operations\n-sassme string-operations\n ';

var out_numberoperation = 'Number Operations\n\nSassScript supports the standard arithmetic operations on numbers (addition +, subtraction -, multiplication *, division /, and modulo %). Sass math functions preserve units during arithmetic operations. This means that, just like in real life, you cannot work on numbers with incompatible units (such as adding a number with px and em) and two numbers with the same unit that are multiplied together will produce square units (10px * 10px == 100px * px). Be Aware that px * px is an invalid CSS unit and you will get an error from Sass for attempting to use invalid units in CSS.\n\nRelational operators (<, >, <=, >=) are also supported for numbers, and equality operators (==, !=) are supported for all types.\n\nDivision and /\n\nCSS allows / to appear in property values as a way of separating numbers. Since SassScript is an extension of the CSS property syntax, it must support this, while also allowing / to be used for division. This means that by default, if two numbers are separated by / in SassScript, then they will appear that way in the resulting CSS.\n\nHowever, there are three situations where the / will be interpreted as division. These cover the vast majority of cases where division is actually used. They are:\n\nIf the value, or any part of it, is stored in a variable or returned by a function.\nIf the value is surrounded by parentheses.\nIf the value is used as part of another arithmetic expression.\n\nFor example:\n--------------------------------------------------------\np {\n  font: 10px/8px;             // Plain CSS, no division\n  $width: 1000px;\n  width: $width/2;            // Uses a variable, does division\n  width: round(1.5)/2;        // Uses a function, does division\n  height: (500px/2);          // Uses parentheses, does division\n  margin-left: 5px + 8px/2px; // Uses +, does division\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\np {\n  font: 10px/8px;\n  width: 500px;\n  height: 250px;\n  margin-left: 9px; }\n--------------------------------------------------------\n\nIf you want to use variables along with a plain CSS /, you can use #{} to insert them. For example:\n\n--------------------------------------------------------\np {\n  $font-size: 12px;\n  $line-height: 30px;\n  font: #{$font-size}/#{$line-height};\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\np {\n  font: 12px/30px; }\n--------------------------------------------------------';

var out_coloroperation = 'Color Operations\n\nAll arithmetic operations are supported for color values, where they work piecewise. This means that the operation is performed on the red, green, and blue components in turn. \n\nFor example:\n--------------------------------------------------------\np {\n  color: #010203 + #040506;\n}\n--------------------------------------------------------\n\ncomputes 01 + 04 = 05, 02 + 05 = 07, and 03 + 06 = 09, and is compiled to:\n--------------------------------------------------------\np {\n  color: #050709; }\nOften it\u2019s more useful to use color functions than to try to use color arithmetic to achieve the same effect.\n--------------------------------------------------------\n\nArithmetic operations also work between numbers and colors, also piecewise. For example:\n\n--------------------------------------------------------\np {\n  color: #010203 * 2;\n}\n--------------------------------------------------------\n\ncomputes 01 * 2 = 02, 02 * 2 = 04, and 03 * 2 = 06, and is compiled to:\n--------------------------------------------------------\np {\n  color: #020406; }\n--------------------------------------------------------\n\nNote that colors with an alpha channel (those created with the rgba or hsla functions) must have the same alpha value in order for color arithmetic to be done with them. The arithmetic doesn\u2019t affect the alpha value. \n\nFor example:\n--------------------------------------------------------\np {\n  color: rgba(255, 0, 0, 0.75) + rgba(0, 255, 0, 0.75);\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\np {\n  color: rgba(255, 255, 0, 0.75); }\n--------------------------------------------------------\n\nThe alpha channel of a color can be adjusted using the opacify and transparentize functions. \n\nFor example:\n--------------------------------------------------------\n$translucent-red: rgba(255, 0, 0, 0.5);\np {\n  color: opacify($translucent-red, 0.3);\n  background-color: transparentize($translucent-red, 0.25);\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\np {\n  color: rgba(255, 0, 0, 0.8);\n  background-color: rgba(255, 0, 0, 0.25); }\n--------------------------------------------------------\n\nIE filters require all colors include the alpha layer, and be in the strict format of #AABBCCDD. You can more easily convert the color using the ie_hex_str function. \n\nFor example:\n--------------------------------------------------------\n$translucent-red: rgba(255, 0, 0, 0.5);\n$green: #00ff00;\ndiv {\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=\'false\', startColorstr=\'#{ie-hex-str($green)}\', endColorstr=\'#{ie-hex-str($translucent-red)}\');\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\ndiv {\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=\'false\', startColorstr=#FF00FF00, endColorstr=#80FF0000);\n}\n--------------------------------------------------------';

var out_stringoperation = 'String Operations\n\nThe + operation can be used to concatenate strings:\n--------------------------------------------------------\np {\n  cursor: e + -resize;\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\np {\n  cursor: e-resize; }\n--------------------------------------------------------\n\nNote that if a quoted string is added to an unquoted string (that is, the quoted string is to the left of the +), the result is a quoted string. Likewise, if an unquoted string is added to a quoted string (the unquoted string is to the left of the +), the result is an unquoted string. \n\nFor example:\n--------------------------------------------------------\np:before {\n  content: \"Foo \" + Bar;\n  font-family: sans- + \"serif\";\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\np:before {\n  content: \"Foo Bar\";\n  font-family: sans-serif; }\n--------------------------------------------------------\n\nBy default, if two values are placed next to one another, they are concatenated with a space:\n--------------------------------------------------------\np {\n  margin: 3px + 4px auto;\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\np {\n  margin: 7px auto; }\n--------------------------------------------------------\n\nWithin a string of text, #{} style interpolation can be used to place dynamic values within the string:\n\n--------------------------------------------------------\np:before {\n  content: \"I ate #{5 + 10} pies!\";\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\np:before {\n  content: \"I ate 15 pies!\"; }\n--------------------------------------------------------\n\nNull values are treated as empty strings for string interpolation:\n--------------------------------------------------------\n$value: null;\np:before {\n  content: \"I ate #{$value} pies!\";\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\np:before {\n  content: \"I ate  pies!\"; }\n--------------------------------------------------------';

var out_booleanoperation = 'Boolean Operations\n\nSassScript supports and, or, and not operators for boolean values.';

var out_listoperation = 'List Operations\n\nLists don\'t support any special operations. Instead, they\'re manipulated using the list functions.';

var out_parenthesis = 'Parentheses\n\nParentheses can be used to affect the order of operations:\n--------------------------------------------------------\np {\n  width: 1em + (2em * 3);\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\np {\n  width: 7em; }\n--------------------------------------------------------';

var out_functions = 'Functions\n\nSassScript defines some useful functions that are called using the normal CSS function syntax:\n--------------------------------------------------------\np {\n  color: hsl(0, 100%, 50%);\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\np {\n  color: #ff0000; }\n--------------------------------------------------------\n\n\nKeyword Arguments\n\nSass functions can also be called using explicit keyword arguments. The above example can also be written as:\n--------------------------------------------------------\np {\n  color: hsl($hue: 0, $saturation: 100%, $lightness: 50%);\n}\n--------------------------------------------------------\n\nWhile this is less concise, it can make the stylesheet easier to read. It also allows functions to present more flexible interfaces, providing many arguments without becoming difficult to call.\n\nNamed arguments can be passed in any order, and arguments with default values can be omitted. Since the named arguments are variable names, underscores and dashes can be used interchangeably.';

var out_shell = 'SassScript\n\nIn addition to the plain CSS property syntax, Sass supports a small set of extensions called SassScript. SassScript allows properties to use variables, arithmetic, and extra functions. SassScript can be used in any property value.\n\nSassScript can also be used to generate selectors and property names, which is useful when writing mixins. This is done via interpolation.\n\n---\n\nInteractive Shell\n\nYou can easily experiment with SassScript using the interactive shell. To launch the shell run the sass command-line with the -i option. At the prompt, enter any legal SassScript expression to have it evaluated and the result printed out for you:\n--------------------------------------------------------\n$ sass -i\n>> \"Hello, Sassy World!\"\n\"Hello, Sassy World!\"\n>> 1px + 1px + 1px\n3px\n>> #777 + #777\n#eeeeee\n>> #777 + #888\nwhite\n--------------------------------------------------------';

var out_interpolation = 'Interpolation: \n\nYou can also use SassScript variables in selectors and property names using #{} interpolation syntax:\n--------------------------------------------------------\n$name: foo;\n$attr: border;\np.#{$name} {\n  #{$attr}-color: blue;\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\np.foo {\n  border-color: blue; }\n--------------------------------------------------------\n\nIt\u2019s also possible to use #{} to put SassScript into property values. In most cases this isn\u2019t any better than using a variable, but using #{} does mean that any operations near it will be treated as plain CSS. \nFor example:\n--------------------------------------------------------\np {\n  $font-size: 12px;\n  $line-height: 30px;\n  font: #{$font-size}/#{$line-height};\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\np {\n  font: 12px/30px; }\n--------------------------------------------------------';

var out_default = 'Variable Defaults: !default\n\nYou can assign to variables if they aren\u2019t already assigned by adding the !default flag to the end of the value. This means that if the variable has already been assigned to, it won\u2019t be re-assigned, but if it doesn\u2019t have a value yet, it will be given one.\n\nFor example:\n--------------------------------------------------------\n$content: \"First content\";\n$content: \"Second content?\" !default;\n$new_content: \"First time reference\" !default;\n\n#main {\n  content: $content;\n  new-content: $new_content;\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\n#main {\n  content: \"First content\";\n  new-content: \"First time reference\"; }\nVariables with null values are treated as unassigned by !default:\n\n$content: null;\n$content: \"Non-null content\" !default;\n--------------------------------------------------------\n\n--------------------------------------------------------\n#main {\n  content: $content;\n}\n--------------------------------------------------------\n\nis compiled to:\n--------------------------------------------------------\n#main {\n  content: \"Non-null content\"; }\n--------------------------------------------------------';

var out_atrules = '@-Rules and Directives\n\nSass supports all CSS3 @-rules, as well as some additional Sass-specific ones known as \u201cdirectives.\u201d These have various effects in Sass, detailed below. See also control directives and mixin directives.\n\nTry these for more info:\n- sassme @import\n- sassme @media\n- sassme @extend\n- sassme @at-root\n- sassme @debug\n- sassme @warn';


program
  .version('0.0.1')
  .option('nesting', 'Simple example of nesting')
  .option('nested-properties', 'Nested properties')
  .option('nested-rules', 'Nested rules')
  .option('parent', 'Parent Selectors: &')
  .option('placeholders', 'Placeholder Selectors: %meow')
  .option('comments', 'Comments: /* */ and //')
  .option('sass-shell', 'SassScript Shell')
  .option('variables', 'What are variables')
  .option('datatypes', 'Overview of 6 Sass data types')
  .option('string', 'String data type')
  .option('map', 'Map data type')
  .option('list', 'List data type')
  .option('color', 'Color data type')
  .option('operation', 'Sass operations overview')
  .option('color-operation', 'Color operations')
  .option('number-operation', 'Number operations')
  .option('string-operation', 'String operations')
  .option('list-operation', 'List operations')
  .option('bool-operation', 'Boolean operations')
  .option('parenthesis', 'These things: ()')
  .option('functions', 'Cool Sass functions')
  .option('interpolation', '#{} interpolation syntax')
  .option('default', 'Variable defaults: !default')
  .parse(process.argv);

function readSassMe () {
	
// get the arguments, minus node
	var args = process.argv.slice(2).toString();

	if (args == 'nesting') {
		console.log(out_nesting);
	}	

	else if (args == 'nested-properties') {
		console.log(out_nestedprops);
	}

	else if (args == 'nested-rules') {
		console.log(out_nestedrules);
	}

	else if (['parents', 'parent', 'parent-selectors', 'parent-selector'].indexOf(args) > -1) {
		console.log(out_parent);
	}

	else if (['vars', 'variables', 'variable'].indexOf(args) > -1) {
		console.log(out_vars);
	}

	else if (['placeholder', 'placeholders'].indexOf(args) > -1) {
		console.log(out_placeholders);
	}

	else if (['comment', 'comments'].indexOf(args) > -1) {
		console.log(out_comments);
	}

	else if (['datatypes', 'data-types'].indexOf(args) > -1) {
		console.log(out_datatype);
	}

	else if (['string', 'strings'].indexOf(args) > -1) {
		console.log(out_string);
	}

	else if (['map', 'maps'].indexOf(args) > -1) {
		console.log(out_map);
	}

	else if (['list', 'lists'].indexOf(args) > -1) {
		console.log(out_list);
	}

	else if (['color', 'colors'].indexOf(args) > -1) {
		console.log(out_color);
	}

	else if (['operation', 'operations'].indexOf(args) > -1) {
		console.log(out_operation);
	}

	else if (['number-operation', 'number-operations'].indexOf(args) > -1) {
		console.log(out_numberoperation);
	}

	else if (['color-operation', 'color-operations'].indexOf(args) > -1) {
		console.log(out_coloroperation);
	}

	else if (['string-operation', 'string-operations'].indexOf(args) > -1) {
		console.log(out_stringoperation);
	}

	else if (['list-operation', 'list-operations'].indexOf(args) > -1) {
		console.log(out_listoperation);
	}

	else if (['bool-operation', 'bool-operations', 'boolean-operation', 'boolean-operations'].indexOf(args) > -1) {
		console.log(out_booleanoperation);
	}

	else if (['sass-shell', 'sassscript', 'sass-script', 'sass-script-shell', 'shell'].indexOf(args) > -1) {
		console.log(out_shell);
	}

	else if (args == 'parenthesis') {
		console.log(out_parenthesis);
	}

	else if (['function', 'functions'].indexOf(args) > -1) {
		console.log(out_functions);
	}

	else if (['interpolation'].indexOf(args) > -1) {
		console.log(out_interpolation);
	}

	else if (['interpolation'].indexOf(args) > -1) {
		console.log(out_interpolation);
	}

	else if (['default', 'defaults'].indexOf(args) > -1) {
		console.log(out_default);
	}

	else if (['@-rules', '@rules', 'at-rules'].indexOf(args) > -1) {
		console.log(out_atrules);
	}

	else {
		console.log(error);
	}
};

readSassMe();