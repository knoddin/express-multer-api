'use strict';

const multer = require('multer');
const storage = multer.memoryStorage(); //don't do this with real apps
//generally someone else should be setting this up for you - depending on
// environment you are in

module.exports = multer({ storage });
