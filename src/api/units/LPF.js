"use strict";

const madd = require("../operators/madd");
const declareFunc = require("../../utils/declareFunc");
const createNode = require("../../utils/createNode");
const multiNew = require("../../utils/multiNew");
const getSameRate = require("../../utils/getSameRate");
const checkSameRate = require("../../utils/checkSameRate");

const propDefs = [
  [ "in"  ,   0 ],
  [ "freq", 440 ],
  [ "mul" ,   1 ],
  [ "add" ,   0 ],
];

const sameRateAsFirstInput = getSameRate(0, [ "audio", "control" ]);
const createNodeIfCheckSameRate = checkSameRate(0, createNode);

function $(rate) {
  return (_in, freq, mul, add) => {
    return madd(multiNew("LPF", rate, [ _in, freq ], createNodeIfCheckSameRate), mul, add);
  };
}

const LPF = declareFunc(propDefs, $(sameRateAsFirstInput));

LPF.ar = declareFunc(propDefs, $("audio"));
LPF.kr = declareFunc(propDefs, $("control"));

module.exports = LPF;
