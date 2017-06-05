"use strict";

const UnaryOpUGenIndex = `
neg not isNil notNil bitNot abs asFloat asInt ceil floor frac sign squared cubed sqrt exp reciprocal
midicps cpsmidi midiratio ratiomidi dbamp ampdb octcps cpsoct log log2 log10 sin cos tan asin acos
atan sinh cosh tanh rand rand2 linrand bilinrand sum3rand distort softclip coin digitvalue silence
thru rectWindow hanWindow welWindow triWindow ramp scurve
`.trim().split(/\s/);

const BinaryOpUGenIndex = `
+ - * / // % == != < > <= >= min max bitAnd bitOr bitXor lcm gcd round roundUp trunc atan2 hypot
hypotApx pow << >> >>> fill ring1 ring2 ring3 ring4 difsqr sumsqr
sqrsum sqrdif absdif thresh amclip scaleneg clip2 excess fold2 wrap2 firstarg rrand exprand
`.trim().split(/\s/);

function createOpIndexTable(indices, type) {
  return indices.reduce((obj, key, specialIndex) => {
    return (obj[key] = { type, specialIndex }), obj;
  }, {})
}

const opIndexTable = Object.assign({},
  createOpIndexTable(UnaryOpUGenIndex, "UnaryOpUGen"),
  createOpIndexTable(BinaryOpUGenIndex, "BinaryOpUGen")
);

function getSpecialIndex(opName) {
  if (opIndexTable.hasOwnProperty(opName)) {
    return opIndexTable[opName];
  }
  return { type: opName, specialIndex: 0 };
}

module.exports = getSpecialIndex;
