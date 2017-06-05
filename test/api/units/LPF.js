"use strict";

const assert = require("assert");
const LPF = require("../../../src/api/units/LPF");
const createNode = require("../../../src/utils/createNode");
const isSCNode = require("../../../src/utils/isSCNode");

describe("units/LPF(in, freq, mul, add)", () => {
  it("default rate is the same as first input", () => {
    const a = createNode("Saw", "audio", [ 440, 0 ]);
    const node = LPF(a, 1000);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "LPF", rate: "audio", props: [ a, 1000 ]
    });
  });

  it(".ar should create audio rate node", () => {
    const a = createNode("Saw", "audio", [ 440, 0 ]);
    const node = LPF.ar(a, 1000);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "LPF", rate: "audio", props: [ a, 1000 ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("LFSaw", "control", [ 440, 0 ]);
    const node = LPF.kr(a, 1000);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "LPF", rate: "control", props: [ a, 1000 ]
    });
  });

  it("should throw TypeError when given different rate input", () => {
    const a = createNode("LFSaw", "control", [ 440, 0 ]);

    assert.throws(() => {
      LPF.ar(a, 1000);
    }, TypeError);
  });
});
