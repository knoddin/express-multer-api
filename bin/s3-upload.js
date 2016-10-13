'use strict';


const fs = require('fs');
const fileType = require('file-type');

const filename = process.argv[2] || '';

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (error, data) => {
      if (error) {
        reject(error);
      }
      resolve(data);
    });
  });
};

// return a default object in the case that fileType is given an unsupported
// file type
const mimeType = (data) => {
  return Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
  }, fileType(data));
};

// if filetype returned png, ext gets overwritten

const parseFile = (fileBuffer) => {
  let file = mimeType(fileBuffer);
  file.data = fileBuffer;
  return file;
};

// buffer is temporary holding place in memory for a sequence of bytes.

const logMessage = (file) => { //the buffer is now on data key of file
  console.log(`${filename} is ${file.data.length} bytes long and is type of mime ${file.mime}`);
};

readFile(filename)
.then(parseFile)
.then(logMessage)
.catch(console.error);
