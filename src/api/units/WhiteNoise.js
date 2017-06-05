"use strict";

const madd = require("../operators/madd");
const declareFunc = require("../../utils/declareFunc");
const multiNew = require("../../utils/multiNew");

const propDefs = [
  [ "mul", 1 ],
  [ "add", 0 ],
];

function $(rate) {
  return (mul, add) => {
    return madd(multiNew("WhiteNoise~", rate), mul, add);
  };
}

const WhiteNoise = declareFunc(propDefs, $("audio"));

WhiteNoise.ar = declareFunc(propDefs, $("audio"));
WhiteNoise.kr = declareFunc(propDefs, $("control"));

module.exports = WhiteNoise;
