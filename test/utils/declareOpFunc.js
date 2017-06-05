"use strict";

const assert = require("assert");
const declareOpFunc = require("../../src/utils/declareOpFunc");
const createNode = require("../../src/utils/createNode");
const createRef = require("../../src/utils/createRef");
const isSCNode = require("../../src/utils/isSCNode");
const isSCRef = require("../../src/utils/isSCRef");
const toUnitInput = require("../../src/utils/toUnitInput");

const max = declareOpFunc("max", (a, b) => {
  return Math.max(a, b);
});

const firstArg = declareOpFunc("firstArg", (a, b) => {
  return b, a;
}, true);

describe("utils/declareOpFunc(name, fn, disableCreateNode)", () => {
  it("should eval when given numeric only", () => {
    assert(max(2, 5) === 5);
  });

  it("should return a same shape array when given array", () => {
    assert.deepEqual(max([ 2, 8 ], [ 5, 6 ]), [ 5, 8 ]);
    assert.deepEqual(max([ 2, 4, [ 6 ] ], 5), [ 5, 5, [ 6 ] ]);
    assert.deepEqual(max(5, [ 2, 4, [ 6 ] ]), [ 5, 5, [ 6 ] ]);
  });

  it("should return a sc.ref when given sc.ref", () => {
    const a = max(createRef(2), 5);
    const b = max(a, [ 3, createRef(10) ]);

    assert(isSCRef(a));
    assert(toUnitInput(a) === 5);
    assert(Array.isArray(b) && b.length === 2);
    assert(toUnitInput(b[0]) === 5);
    assert(toUnitInput(b[1]) === 10);
  });

  it("should return a sc.node when given sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = max(a, 0.5);

    assert(isSCNode(b));
    assert.deepEqual(b, {
      type: "max", rate: "audio", props: [ a, 0.5, ],
    });
  });

  it("should skip creating node when given 3rd argument is true", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = firstArg(a, 0);

    assert(b === a);
  });

  it("should throw TypeError when args.length < fn.length", () => {
    assert.throws(() => {
      max(1);
    });
  });

  it("should throw TypeError when given invalid type value", () => {
    assert.throws(() => {
      max(1, "2");
    });
  });
});
