"use strict";

const mul = require("./mul");
const add = require("./add");

module.exports = (a, b, c) => {
  return add(mul(a, b), c);
};
