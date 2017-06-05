"use strict";

const madd = require("../operators/madd");
const declareFunc = require("../../utils/declareFunc");
const toUnitInput = require("../../utils/toUnitInput");
const createNode = require("../../utils/createNode");
const multiNew = require("../../utils/multiNew");

const propDefs = [
  [ "env"       , 0 ],
  [ "gate"      , 1 ],
  [ "levelScale", 1 ],
  [ "levelBias" , 0 ],
  [ "timeScale" , 1 ],
  [ "doneAction", 0 ],
  [ "mul"       , 1 ],
  [ "add"       , 0 ],
];

function $(rate) {
  return (env, gate, levelScale, levelBias, timeScale, doneAction, mul, add) => {
    return madd(multiNew("EnvGen", rate, [ env, gate, levelScale, levelBias, timeScale, doneAction ], createEnvGen), mul, add);
  };
}

function createEnvGen(type, rate, props) {
  const envArray = toUnitInput(props[0]);

  if (!isValidEnv(envArray)) {
    throw new TypeError(`
      invalid envelope
    `.trim());
  }

  return createNode(type, rate, props.slice(1).concat(envArray));
}

function isValidEnv(envArray) {
  /* istanbul ignore next */
  if (!Array.isArray(envArray)) {
    return false;
  }

  const paramLength = (envArray.length - 4) / 4;
  const releaseNode = envArray[2];
  const loopNode = envArray[3];

  return envArray[1] === paramLength &&
    (releaseNode === -99 || releaseNode < paramLength) &&
    (loopNode    === -99 || loopNode    < paramLength);
}

const EnvGen = declareFunc(propDefs, $("control"));

EnvGen.ar = declareFunc(propDefs, $("audio"));
EnvGen.kr = declareFunc(propDefs, $("control"));

module.exports = EnvGen;
