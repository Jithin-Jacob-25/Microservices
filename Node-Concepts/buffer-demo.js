// Buffers are objects that help you work with binary data directly. 
/*
  Examples:
    1. File System operations
    2. Cryptography
    3. Image processing
*/

const buffOne = Buffer.alloc(10); // Allocates a buffer of 10 bytes initialized with zeros
console.log('Buffer 1:', buffOne);

// Creating a buffer from a String
const buffFromString = Buffer.from('Hello, Buffer!'); 
console.log('Buffer 2:', buffFromString);

// Creating a buffer from an array of Integers
const buffFromArrayOfIntegers = Buffer.from([1, 2, 3, 4, 5]); // Represents 'Hello'
console.log('Buffer 3:', buffFromArrayOfIntegers);

// Write a string to a buffer
buffOne.write('Node.js');
console.log('Buffer 1 after write:', buffOne.toString());

console.log(buffFromString[0]);
console.log(buffFromArrayOfIntegers.slice(0, 3));

const buffConcat = Buffer.concat([buffOne, buffFromString]);

console.log('Concatenated Buffer:', buffConcat);

console.log(buffConcat.toJSON());