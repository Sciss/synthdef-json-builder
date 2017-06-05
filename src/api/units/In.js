"use strict";

const declareFunc = require("../../utils/declareFunc");
const multiMap = require("../../utils/multiMap");
const createNode = require("../../utils/createNode");
const multiOut = require("../../utils/multiOut");

const propDefs = [
  [ "bus", 0 ],
  [ "ch" , 1 ],
];

function $(rate) {
  return (bus, ch) => {
    return multiMap([ bus, ch ], (bus, ch) => {
      return multiOut(createNode("In", rate, [ bus ]), ch);
    });
  };
}

const In = declareFunc(propDefs, $("audio"));

In.ar = declareFunc(propDefs, $("audio"));
In.kr = declareFunc(propDefs, $("control"));

module.exports = In;
