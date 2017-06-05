"use strict";

function isSCNode(value) {
  return !!(value && value.$$typeof === "sc.node");
}

module.exports = isSCNode;
