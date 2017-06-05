"use strict";

const createNode = require("./createNode");
const multiMap = require("./multiMap");

function multiNew(type, rate, props = [], create = createNode) {
  return multiMap(props, (...props) => create(type, rate, props));
}

module.exports = multiNew;
