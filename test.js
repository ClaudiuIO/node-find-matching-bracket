var findBracket = require('./findMatchingBracket');

var codes = [
	{
		code: "{} some more stuff"
	}, {
		code: "function () { console.log('hello'); } some more stuff",
		index: 12
	}, {
		code: "CGApp.WinPanel = function(initData) { \n" +
			"    this.id = (!initData || typeof initData.id === 'undefined') ? ('AutoWinPanelID-' + CGE.GameGUID.getNew()) : (initData.id);\n" +
			"\n" +
			"    CGE.DisplayCanvas.call(this, initData);\n" +
			"\n" +
			"    this.preparePanel(initData);\n" +
			"/re}g/g;\n" +
			"};",
		index: 36
	}
].forEach(function (obj, index) {
	try {
		var from = obj.index || 0;
		var to = findBracket(obj.code, obj.index);
		console.log(index + ":", from, '-', to, obj.code.substring(from, to));
	} catch ( err ) {
		console.log(index + ":", err);
	}
});