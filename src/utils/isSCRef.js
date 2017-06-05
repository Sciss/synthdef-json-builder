"use strict";

function isSCRef(value) {
  return !!(value && value.$$typeof === "sc.ref");
}

module.exports = isSCRef;
