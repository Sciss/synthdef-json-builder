"use strict";

const createNode = require("./createNode");
const multiMap = require("./multiMap");

function multiOut(node, length) {
  if (typeof length === "number") {
    return Array.from({ length }, (_, index) => createOutputProxy(node, index, length));
  }
  return multiMap([ node, length ], multiOut);
}

function createOutputProxy(node, index, length) {
  if (Array.isArray(node)) {
    return node.map(node => createOutputProxy(node, index, length));
  }
  return createNode("OutputProxy", node.rate, [ node, index, length ]);
}

module.exports = multiOut;
