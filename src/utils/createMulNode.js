"use strict";

const createNode = require("./createNode");
const isSCNode = require("./isSCNode");
const sortByRate = require("./sortByRate");
const isNumber = require("./isNumber");

function createMulNode(a, b) {
  if (isNumber(a * b)) {
    return a * b;
  }

  [ a, b ] = sortByRate([ a, b ]);

  if (b === 0) {
    return 0;
  }

  if (b === 1) {
    return a;
  }

  if (isSCNode(a) && a.type === "*" && isNumber(a.props[1] * b)) {
    return createNode("*", a.rate, [ a.props[0], a.props[1] * b ]);
  }

  return createNode("*", a.rate, [ a, b ]);
}

module.exports = createMulNode;
