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

const upload = (file) =>{
  const options = {
    // get the bucket name from AWS S3 console
    Bucket: 'wdiknoddinbucket',
    // attach filebugger as a stream to sent to amazon
    Body: file.data,
    // allow anyone to access the url of the uploaded file
    ACL: 'public-read',
    // tell amazon what the mime type is
    ContentType: file.mime,
    // pick a filename for S3 to use for the upload
    Key: `test/test.${file.ext}`
  };
  // dont actually upload yet, just pass the data down the promise chain
  return Promise.resolve(options);
};

const logMessage = (upload) => { //the buffer is now on data key of file
  // get rid of the stream for now, so i can log rest of options in the
  // terminal without seeing the stream
  delete upload.Body;
  // turn the pojo into a string so i can see it on the console
  console.log(`the upload options are ${JSON.stringify(upload)}`);
};

readFile(filename)
.then(parseFile)
.then(upload)
.then(logMessage)
.catch(console.error);
