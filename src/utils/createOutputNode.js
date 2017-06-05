"use strict";

const createNode = require("./createNode");
const toArray = require("./toArray");

function createOutputNode(items) {
  const object = createNode(0, "scalar", toArray(items));

  Object.defineProperties(object, {
    toUnitInput: {
      value: () => 0,
      enumerable: false, writable: true, configurable: true
    },
  });

  return object;
}

module.exports = createOutputNode;
