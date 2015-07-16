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
        async = require('async'),
        BigNumber = require('bignumber.js'),
        fs = require('fs'),
        path = require('path'),
        homedir = require('homedir')(),
        ClamGetRawBlockByNumber;

    ClamGetRawBlockByNumber = function(blockid, cb) {
        var configFile = path.join(homedir, '.clamrpc', 'config.json'),
            client;

        if(!fs.existsSync(configFile)) {
            console.error(configFile + ' does not exist!');
        } else {
            client = new clamcoin.Client(JSON.parse(fs.readFileSync(configFile, 'utf8')));

            client.cmd('getblockbynumber', blockid, true, true, function(err, block) {
                cb(block);
            });
        }
    };

    return ClamGetRawBlockByNumber;
}));
