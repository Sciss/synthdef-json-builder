"use strict";

const unbind = require("../../utils/unbind");
const createRef = require("../../utils/createRef");

function ref(value) {
  return createRef(() => value);
}

module.exports = unbind(ref);
