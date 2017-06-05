"use strict";

const createSumNode = require("../../utils/createSumNode");
const multiMap = require("../../utils/multiMap");
const unbind = require("../../utils/unbind");

function mix(items) {
  return multiMap(items, (...items) => createSumNode(...items));
}

module.exports = unbind(mix);
