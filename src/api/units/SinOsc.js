"use strict";

const madd = require("../operators/madd");
const declareFunc = require("../../utils/declareFunc");
const multiNew = require("../../utils/multiNew");

const propDefs = [
  [ "freq" , 440 ],
  [ "phase",   0 ],
  [ "mul"  ,   1 ],
  [ "add"  ,   0 ],
];

function $(rate) {
  return (freq, phase, mul, add) => {
    return madd(multiNew("SinOsc", rate, [ freq, phase ]), mul, add);
  };
}

const SinOsc = declareFunc(propDefs, $("audio"));

SinOsc.ar = declareFunc(propDefs, $("audio"));
SinOsc.kr = declareFunc(propDefs, $("control"));

module.exports = SinOsc;
