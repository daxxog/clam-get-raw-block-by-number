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
        BigNumber = require('bignumber.js'),
        fs = require('fs'),
        path = require('path'),
        homedir = require('homedir')(),
        Script = bitcore.Script,
        Block = bitcore.Block,
        ClamGetRawBlockByNumber;
    
    ClamGetRawBlockByNumber = function(blockid, cb) {
        var configFile = path.join(homedir, '.clamrpc', 'config.json'),
            client;

        if(!fs.existsSync(configFile)) {
            console.error(configFile + ' does not exist!');
        } else {
            client = new clamcoin.Client(JSON.parse(fs.readFileSync(configFile, 'utf8')));

            client.cmd('getblockbynumber', blockid, function(err, block) {
                async.map(block.tx, function(tx, cb) {
                    client.cmd('gettransaction', tx, cb);
                }, function(err, tx) {
                    if(err) {
                        console.error(err);
                    } else {
                        block.tx = tx;

                        cb(ClamGetRawBlockByNumber.transformBlockObject(block).toString());
                    }
                });
            });
        }
    };

    ClamGetRawBlockByNumber.transformBlockObject = function(block) {
        var blockTransformed = {};

        blockTransformed.header = {};
        blockTransformed.header.version = block.version;
        blockTransformed.header.prevHash = block.previousblockhash;
        blockTransformed.header.merkleRoot = block.merkleroot;
        blockTransformed.header.time = block.time;
        blockTransformed.header.bits = parseInt(block.bits, 16);
        blockTransformed.header.nonce = block.nonce;

        blockTransformed.transactions = block.tx.map(function(tx) {
            var inputs, outputs;

            inputs = tx.vin.map(function(vin) {
                var input = {};

                if(typeof vin.coinbase === 'string') {
                    input.prevTxId = '0000000000000000000000000000000000000000000000000000000000000000';
                    input.outputIndex = vin.sequence;
                    input.sequenceNumber = 0;
                    input.script = (new Script(vin.coinbase)).toString();
                } else {
                    input.prevTxId = vin.txid;
                    input.outputIndex = vin.vout;
                    input.sequenceNumber = vin.sequence;
                    input.script = (new Script(vin.scriptSig.hex)).toString();
                }

                return input;
            });

            outputs = tx.vout.map(function(vout) {
                var output = {};

                output.satoshis = new BigNumber(vout.value).mul(100000000).toNumber();
                output.script = vout.scriptPubKey.asm.split(' ').map(function(part) {
                    if(part.split('OP_').length === 1) {
                        return '20 0x' + part;
                    } else {
                        return part;
                    }
                }).join(' ');

                return output;
            });

            return {
                version: tx.version,
                inputs: inputs,
                outputs: outputs,
                nLockTime: 0
            };
        });

        return new Block(blockTransformed);
    };

    return ClamGetRawBlockByNumber;
}));
