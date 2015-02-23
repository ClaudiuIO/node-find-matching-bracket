function findMatchingBracket(_str, _from) {
	_from = _from || 0;
	
	var CHAR_OPEN = '{',
		CHAR_CLOSED = '}',
		CHAR_ESCAPE = '\\',
		CHAR_FORWARD_SLASH = '/',
		CHAR_QUOTE_1 = "'",
		CHAR_QUOTE_2 = '"';
		
	if ( _str.charAt(_from) != CHAR_OPEN ) {
		throw "Does not start with bracket";
	}
	
	var STATE_NORMAL = 0,
		STATE_REGEX = 1,
		STATE_STRING = 2;
	
	var state = STATE_NORMAL,
		quoteChar = null,
		level = 0;
	
	for ( var i = _from, len = _str.length; i < len; i++ ) {
		var letter = _str.charAt(i);
		switch ( state ) {
			case STATE_NORMAL :
				if ( letter == CHAR_ESCAPE ) {
					throw "Invalid escape";
				}
				if ( letter == CHAR_OPEN ) {
					level++;
					break;
				}
				if ( letter == CHAR_CLOSED ) {
					level--;
					if ( level < 0 ) {
						throw "Decreased too low";
					}
					if ( level == 0 ) {
						return i;
					}
					break;
				}
				if ( letter == CHAR_QUOTE_1 || letter == CHAR_QUOTE_2 ) {
					quoteChar = letter;
					state = STATE_STRING;
					break;
				}
				if ( letter == CHAR_FORWARD_SLASH ) {
					var regIndex = testRegex(i);
					if ( regIndex == -1 ) {
						break;
					}
					i = regIndex - 1;
					break;
				}
				break;
			case STATE_STRING :
				if ( letter == CHAR_ESCAPE ) {
					i++;
					break;
				}
				if ( letter == quoteChar ) {
					quoteChar = null;
					state = STATE_NORMAL;
					break;
				}
				break;
			default :
				throw "Unknown State: " + state;
		}
	}
	/*
	 * Function is a port and small modification of FlashDevelops LookupRegex function in ASFileParser.cs code with their permission.
	 * https://github.com/fdorg/flashdevelop/blob/development/External/Plugins/ASCompletion/Model/ASFileParser.cs
	 * 2015/01/26
	 */
	function testRegex(_index) {
		var i0 = _index - 1, c;
		var preValid = "=(,[{;";
		var preWhite = " \t\r\n";
		var invalid = "\r\n";
		while ( i0 > 0 ) {
			c = _str.charAt(i0--);
			if ( preValid.indexOf(c) >= 0 ) break; // ok
			if ( preWhite.indexOf(c) >= 0 ) continue;
			return -1;
		}
		i0 = _index + 1;
		while ( i0 < len ) {
			c = _str.charAt(i0++);
			if ( c == CHAR_ESCAPE ) { i0++; continue; }
			if ( c == CHAR_FORWARD_SLASH ) break; // end of regex;
			if ( invalid.indexOf(c) >= 0 ) return -1;
		}
		return i0;
	}
};

module.exports = findMatchingBracket;