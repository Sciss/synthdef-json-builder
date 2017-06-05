"use strict";

const madd = require("../operators/madd");
const declareFunc = require("../../utils/declareFunc");
const multiNew = require("../../utils/multiNew");

const propDefs = [
  [ "start"     , 1 ],
  [ "end"       , 0 ],
  [ "dur"       , 1 ],
  [ "doneAction", 0 ],
  [ "mul"       , 1 ],
  [ "add"       , 0 ],
];

function $(rate) {
  return (start, end, dur, doneAction, mul, add) => {
    return madd(multiNew("Line", rate, [ start, end, dur, doneAction ]), mul, add);
  };
}

const Line = declareFunc(propDefs, $("control"));

Line.ar = declareFunc(propDefs, $("audio"));
Line.kr = declareFunc(propDefs, $("control"));

module.exports = Line;
