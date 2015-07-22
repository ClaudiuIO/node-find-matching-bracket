var findBracket = require('../index'),
	fs = require('fs');

[
	'/lib/test1.txt',
	'/lib/test2.txt',
	'/lib/test3.txt',
    '/lib/test4.txt'
].forEach(function (path) {
	try {
		var code = fs.readFileSync(__dirname + path, 'utf8');
		var from = code.indexOf('{');
		var to = findBracket(code, from);
		console.log(path + ":", from, '-', to, code.substring(from, to + 1));
	} catch ( err ) {
		console.log(path + ":", err);
	}
	console.log(); // Blank line;
});