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
    return madd(multiNew("HPF", rate, [ _in, freq ], createNodeIfCheckSameRate), mul, add);
  };
}

const HPF = declareFunc(propDefs, $(sameRateAsFirstInput));

HPF.ar = declareFunc(propDefs, $("audio"));
HPF.kr = declareFunc(propDefs, $("control"));

module.exports = HPF;
