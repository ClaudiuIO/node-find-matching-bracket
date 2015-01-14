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
						return i + 1;
					}
					level--;
					break;
				}
				if ( letter == CHAR_QUOTE_1 || letter == CHAR_QUOTE_2 ) {
					quoteChar = letter;
					state = STATE_STRING;
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
};

module.exports = findMatchingBracket;