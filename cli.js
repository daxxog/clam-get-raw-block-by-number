/* ClamGetRawBlockByNumber / cli.js
 * command line interface for ClamGetRawBlockByNumber
 * (c) 2015 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html
 */

var ClamGetRawBlockByNumber = require('./clam-get-raw-block-by-number.js');

ClamGetRawBlockByNumber(parseInt(process.argv[2], 10), function(block) {
	console.log(block);
});
