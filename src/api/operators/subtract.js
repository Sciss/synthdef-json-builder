"use strict";

const declareOpFunc = require("../../utils/declareOpFunc");

module.exports = declareOpFunc("-", (a, b) => {
  return a - b;
});
