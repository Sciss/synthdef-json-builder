"use strict";

const createRef = require("../../utils/createRef");
const declareFunc = require("../../utils/declareFunc");
const multiMap = require("../../utils/multiMap");
const toNumber = require("../../utils/toNumber");
const wrapAt = require("../../utils/wrapAt");

/* istanbul ignore next */
function env() {
  throw new TypeError("env(): not implemented yet");
}

env.triangle = declareEnvFunc([
  [ "dur"  , 1 ],
  [ "level", 1 ],
], (dur, level) => {
  dur   = toNumber(dur);
  level = toNumber(level);

  const levels = [ 0, level, 0 ];
  const times  = [ dur * 0.5, dur * 0.5 ];

  return createEnv(levels, times);
});

env.sine = declareEnvFunc([
  [ "dur"  , 1 ],
  [ "level", 1 ],
], (dur, level) => {
  dur   = toNumber(dur);
  level = toNumber(level);

  const levels = [ 0, level, 0 ];
  const times  = [ dur * 0.5, dur * 0.5 ];
  const curve  = "sine";

  return createEnv(levels, times, curve);
});

env.perc = declareEnvFunc([
  [ "attackTime" ,  0.01 ],
  [ "releaseTime",  1    ],
  [ "level"      ,  1    ],
  [ "curve"      , -4    ],
], (attackTime, releaseTime, level, curve) => {
  attackTime  = toNumber(attackTime);
  releaseTime = toNumber(releaseTime);
  level       = toNumber(level);

  const levels = [ 0, level, 0 ];
  const times  = [ attackTime, releaseTime ];

  return createEnv(levels, times, curve);
});

env.linen = declareEnvFunc([
  [ "attackTime" , 0.01  ],
  [ "sustainTime", 1     ],
  [ "releaseTime", 1     ],
  [ "level"      , 1     ],
  [ "curve"      , "lin" ],
], (attackTime, sustainTime, releaseTime, level, curve) => {
  attackTime  = toNumber(attackTime);
  sustainTime = toNumber(sustainTime);
  releaseTime = toNumber(releaseTime);
  level       = toNumber(level);

  const levels = [ 0, level, level, 0 ];
  const times  = [ attackTime, sustainTime, releaseTime ];

  return createEnv(levels, times, curve);
});

env.cutoff = declareEnvFunc([
  [ "releaseTime", 0.1   ],
  [ "level"      , 1     ],
  [ "curve"      , "lin" ],
], (releaseTime, level, curve) => {
  releaseTime = toNumber(releaseTime);
  level       = toNumber(level);

  const curveShapeIsExponential = +(toShapeNumber(curve) === 2);
  const releaseLevel = 1e-5 * curveShapeIsExponential;
  const levels = [ level, releaseLevel ];
  const times  = [ releaseTime ];

  return createEnv(levels, times, curve, 0);
});

env.dadsr = declareEnvFunc([
  [ "delayTime"   ,  0.1  ],
  [ "attackTime"  ,  0.01 ],
  [ "decayTime"   ,  0.3  ],
  [ "sustainLevel",  0.5  ],
  [ "releaseTime" ,  1    ],
  [ "peakLevel"   ,  1    ],
  [ "curve"       , -4    ],
  [ "bias"        ,  0    ],
], (delayTime, attackTime, decayTime, sustainLevel, releaseTime, peakLevel, curve, bias) => {
  delayTime    = toNumber(delayTime);
  attackTime   = toNumber(attackTime);
  decayTime    = toNumber(decayTime);
  sustainLevel = toNumber(sustainLevel);
  releaseTime  = toNumber(releaseTime);
  peakLevel    = toNumber(peakLevel);
  bias         = toNumber(bias);

  const levels = [ 0, 0, peakLevel, peakLevel * sustainLevel, 0 ].map(x => x + bias);
  const times  = [ delayTime, attackTime, decayTime, releaseTime ];

  return createEnv(levels, times, curve, 3);
});

env.adsr = declareEnvFunc([
  [ "attackTime"  , 0.01 ],
  [ "decayTime"   ,  0.3 ],
  [ "sustainLevel",  0.5 ],
  [ "releaseTime" ,  1   ],
  [ "peakLevel"   ,  1   ],
  [ "curve"       , -4   ],
  [ "bias"        ,  0   ],
], (attackTime, decayTime, sustainLevel, releaseTime, peakLevel, curve, bias) => {
  attackTime   = toNumber(attackTime);
  decayTime    = toNumber(decayTime);
  sustainLevel = toNumber(sustainLevel);
  releaseTime  = toNumber(releaseTime);
  peakLevel    = toNumber(peakLevel);
  bias         = toNumber(bias);

  const levels = [ 0, peakLevel, peakLevel * sustainLevel, 0 ].map(x => x + bias);
  const times  = [ attackTime, decayTime, releaseTime ];

  return createEnv(levels, times, curve, 2);
});

env.asr = declareEnvFunc([
  [ "attackTime"  , 0.01 ],
  [ "sustainLevel",  0.5 ],
  [ "releaseTime" ,  1   ],
  [ "peakLevel"   ,  1   ],
  [ "curve"       , -4   ],
  [ "bias"        ,  0   ],
], (attackTime, sustainLevel, releaseTime, peakLevel, curve, bias) => {
  attackTime   = toNumber(attackTime);
  sustainLevel = toNumber(sustainLevel);
  releaseTime  = toNumber(releaseTime);
  peakLevel    = toNumber(peakLevel);
  bias         = toNumber(bias);

  const levels = [ 0, sustainLevel * peakLevel, 0 ].map(x => x + bias);
  const times  = [ attackTime, releaseTime ];

  return createEnv(levels, times, curve, 1);
});

function declareEnvFunc(propDefs, fn) {
  return declareFunc(propDefs, (...args) => multiMap(args, fn));
}

function createEnv(levels, times, curve, releaseNode, loopNode) {
  return createRef(toEnvParams(levels, times, curve, releaseNode, loopNode));
}

function toEnvParams(levels, times, curve = "lin", releaseNode = -99, loopNode = -99) {
  const length = times.length;
  const params = [];

  params.push(toNumber(levels[0]));
  params.push(length);
  params.push(toNumber(releaseNode)|0);
  params.push(toNumber(loopNode)|0);

  for (let i = 0; i < length; i++) {
    params.push(toNumber(levels[i + 1]));
    params.push(toNumber(times[i]));
    params.push(toShapeNumber(wrapAt(curve, i)));
    params.push(toCurveValue(wrapAt(curve, i)));
  }

  return params;
}

const ShapeNames = {
  "stp": 0, "step": 0,
  "lin": 1, "linear": 1,
  "exp": 2, "exponential": 2,
  "sin": 3, "sine": 3,
  "wel": 4, "welch": 4,
  "sqr": 6, "squared": 6,
  "cub": 7, "cubed": 7,
  "hld": 8, "hold": 8,
};

function toShapeNumber(value) {
  if (ShapeNames.hasOwnProperty(value)) {
    return ShapeNames[value];
  }
  return 5;
}

function toCurveValue(value) {
  return toNumber(value);
}

module.exports = env;
