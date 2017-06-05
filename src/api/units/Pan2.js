"use strict";

const madd = require("../operators/madd");
const declareFunc = require("../../utils/declareFunc");
const createNode = require("../../utils/createNode");
const multiNew = require("../../utils/multiNew");
const multiOut = require("../../utils/multiOut");
const getSameRate = require("../../utils/getSameRate");
const checkSameRate = require("../../utils/checkSameRate");

const propDefs = [
  [ "in"   , 0 ],
  [ "pos"  , 0 ],
  [ "level", 1 ],
  [ "mul"  , 1 ],
  [ "add"  , 0 ],
];

const sameRateAsFirstInput = getSameRate(0, [ "audio", "control" ]);
const createNodeIfCheckSameRate = checkSameRate(0, createNode);

function $(rate) {
  return (_in, pos, level, mul, add) => {
    return madd(multiOut(multiNew("Pan2", rate, [ _in, pos, level ], createNodeIfCheckSameRate), 2), mul, add);
  };
}

const Pan2 = declareFunc(propDefs, $(sameRateAsFirstInput));

Pan2.ar = declareFunc(propDefs, $("audio"));
Pan2.kr = declareFunc(propDefs, $("control"));

module.exports = Pan2;
