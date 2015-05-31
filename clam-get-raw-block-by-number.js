/* ClamGetRawBlockByNumber
 * Get a raw CLAM block by number.
 * (c) 2015 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

/* UMD LOADER: https://github.com/umdjs/umd/blob/master/returnExports.js */
(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals (root is window)
        root.ClamGetRawBlockByNumber = factory();
  }
}(this, function() {
    var clamcoin = require('clamcoin'),
        bitcore = require('bitcore'),
        async = require('async'),
        fs = require('fs'),
        ClamGetRawBlockByNumber;
    
    ClamGetRawBlockByNumber = function(blockid) {
        var client = new clamcoin.Client(JSON.parse(fs.readFileSync('client.config', 'utf8')));

        client.cmd('getblockbynumber', blockid, function(err, block) {
            console.log(block);

            //async map block.tx -> gettransaction
        });
    };

    ClamGetRawBlockByNumber.transformBlockObject = function(block) {
        console.log(block);
    };

    return ClamGetRawBlockByNumber;
}));
