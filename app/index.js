function findMatchingBracket(_str, _from) {
	_from = _from || 0;
	
	var CHAR_OPEN = ['{','[','('],
		CHAR_CLOSED = ['}',']',')'],
        CHAR_TYPE = -1,
		CHAR_ESCAPE = '\\',
		CHAR_FORWARD_SLASH = '/',
		CHAR_QUOTE_1 = "'",
		CHAR_QUOTE_2 = '"',
        CHAR_STAR = "*";
		
	if ( CHAR_OPEN.indexOf(_str.charAt(_from)) === -1 ) {
		throw "Does not start with bracket";
	} else {
      CHAR_TYPE = CHAR_OPEN.indexOf(_str.charAt(_from));
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
				//if ( letter == CHAR_ESCAPE ) {
				//	throw "Invalid escaped";
				//}
				if ( letter == CHAR_OPEN[CHAR_TYPE] ) {
					level++;
					break;
				}
				if ( letter == CHAR_CLOSED[CHAR_TYPE] ) {
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
                    var commentIndex = testComment(i);
                    if ( commentIndex == -1 ) {
                        // not comment
                        var regIndex = testRegex(i);
                        if ( regIndex == -1 ) {
                            // not regex
                            break;
                        }
                        i = regIndex - 1;
                        break;
                    }
                    i = commentIndex - 1;
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
    
    function testComment(_index) {
        var c = _str.charAt(_index + 1);
        if ( c === CHAR_FORWARD_SLASH ) {
            var match = /\n\r|\r\n|\n|\r/.exec(_str.substring(_index+1));
            return (match) ? (_index + match.index + match[0].length) : _str.length;
        } else if ( c === CHAR_STAR ) {
            var match = /\*\//.exec(_str.substring(_index+1));
            return (match) ? (_index + match.index + match[0].length) : _str.length;
        }
        return -1;
    }
};

module.exports = findMatchingBracket;