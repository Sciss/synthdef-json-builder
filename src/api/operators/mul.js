"use strict";

const declareOpFunc = require("../../utils/declareOpFunc");
const createMulNode = require("../../utils/createMulNode");

module.exports = declareOpFunc("mul", (a, b) => {
  return createMulNode(a, b);
}, true);
