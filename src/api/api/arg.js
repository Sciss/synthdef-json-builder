"use strict";

const createNode = require("../../utils/createNode");
const toNumber = require("../../utils/toNumber");

function arg(name, value) {
  return arg.kr(name, value);
}

arg.ar = (name, value) => {
  return createControl("#", name, "audio", value);
};

arg.kr = (name, value) => {
  return createControl("#", name, "control", value);
};

arg.ir = (name, value) => {
  return createControl("#", name, "scalar", value);
};

arg.tr = (name, value) => {
  return createControl("!", name, "control", value);
};

function createControl(ch, name, rate, value) {
  if (!/^[a-z]\w*$/.test(name)) {
    throw new TypeError(`Invalid parameter name: '${ name }'`);
  }

  const type = `${ ch }${ name }`;
  const toValue = ch === "#" ? toNumber : toTrigNumber;

  if (Array.isArray(value)) {
    return value.map((value, index, values) => {
      return createNode(type, rate, [ toValue(value), index, values.length ]);
    });
  }

  return createNode(type, rate, [ toValue(value), 0, 1 ]);
}

function toTrigNumber(value) {
  return +!!value;
}

module.exports = arg;
