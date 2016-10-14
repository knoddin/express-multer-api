'use strict';

// this has to come before anything else
require('dotenv').config(); //put in

const fs = require('fs');
const fileType = require('file-type');
const AWS = require('aws-sdk');

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
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});
// instance of s3 manager that will be authenticated


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
  return new Promise((resolve, reject) => {
    s3.upload(options, (error, data) => {
      if (error) {
        reject(error);
      }
      resolve(data) ;
    });
  });
}; //either an error or data returned from s3

const logMessage = (response) => { //the buffer is now on data key of file

  // turn the pojo into a string so i can see it on the console
  console.log(`the response from AWS was ${JSON.stringify(response)}`);

};

readFile(filename)
.then(parseFile)
.then(upload)
.then(logMessage)
.catch(console.error);
