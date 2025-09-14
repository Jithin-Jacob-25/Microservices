// Streams are like objects that let you read data from a source or write data to a destination in a continuous fashion.
/* 
    Four Types of Streams:
      1. Readable -> used for reading operations
      2. Writable -> used for write operations
      3. Duplex -> can be used for both reading and writing operations
      4. Transform -> can be used for both reading and writing operations, but the data is modified as it is written and read
*/

const fs = require('fs');
const zlib = require('zlib'); // for compression
const crypto = require('crypto'); // for encryption
const {Transform} = require('stream'); // for creating custom streams 

// Creating a transform method that will be fo each chunk of data passed through it does something
class EncryptStream extends Transform {
    constructor(key, vector) {
        super();
        this.key = key;
        this.vector = vector;  
    }

    _transform(chunk, encoding, callback) {
        const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.vector);
        const encrypted = Buffer.concat([cipher.update(chunk), cipher.final()]); //encrypt the chunk that we are gonna pass

        this.push(encrypted); // push the encrypted chunk to the readable side of the stream
        callback();
    }
}

const key = crypto.randomBytes(32); // AES-256 needs a 32 byte key
const vector = crypto.randomBytes(16); // AES needs a 16 byte vector`

const readableStream = fs.createReadStream('input.txt'); // read in chunks of 16 bytes

const gzipStream = zlib.createGzip(); // create a gzip stream

const encryptStream = new EncryptStream(key, vector); // create an instance of the encrypt stream

const writableStream = fs.createWriteStream('output.txt.gz'); // write the compressed data to a file 

// read -> compress -> encrypt -> write

readableStream.pipe(gzipStream).pipe(encryptStream).pipe(writableStream);

console.log("read -> compress -> encrypt -> write");