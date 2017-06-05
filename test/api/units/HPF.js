"use strict";

const assert = require("assert");
const HPF = require("../../../src/api/units/HPF");
const createNode = require("../../../src/utils/createNode");
const isSCNode = require("../../../src/utils/isSCNode");

describe("units/HPF(in, freq, mul, add)", () => {
  it("default rate is the same as first input", () => {
    const a = createNode("Saw", "audio", [ 440, 0 ]);
    const node = HPF(a, 1000);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "HPF", rate: "audio", props: [ a, 1000 ]
    });
  });

  it(".ar should create audio rate node", () => {
    const a = createNode("Saw", "audio", [ 440, 0 ]);
    const node = HPF.ar(a, 1000);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "HPF", rate: "audio", props: [ a, 1000 ]
    });
  });

  it(".kr should create control rate node", () => {
    const a = createNode("LFSaw", "control", [ 440, 0 ]);
    const node = HPF.kr(a, 1000);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "HPF", rate: "control", props: [ a, 1000 ]
    });
  });

  it("should throw TypeError when given different rate input", () => {
    const a = createNode("LFSaw", "control", [ 440, 0 ]);

    assert.throws(() => {
      HPF.ar(a, 1000);
    }, TypeError);
  });
});
