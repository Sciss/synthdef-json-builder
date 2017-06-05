"use strict";

const unbind = require("../../utils/unbind");

function dup(value, length = 2) {
  return Array.from({ length }, () => value);
}

module.exports = unbind(dup);
