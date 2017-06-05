"use strict";

const declareOpFunc = require("../../utils/declareOpFunc");
const createSumNode = require("../../utils/createSumNode");

module.exports = declareOpFunc("add", (a, b) => {
  return createSumNode(a, b);
}, true);
