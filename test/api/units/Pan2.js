"use strict";

const assert = require("assert");
const Pan2 = require("../../../src/api/units/Pan2");
const createNode = require("../../../src/utils/createNode");
const isSCNode = require("../../../src/utils/isSCNode");

describe("units/Pan2(in, pos, level, mul, add)", () => {
  it("default rate is the same as first input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "control", [ 1, 0 ]);
    const node = Pan2(a, b, 0.5);

    assert(Array.isArray(node) && node.length === 2);
    assert(isSCNode(node[0]));
    assert(isSCNode(node[1]));

    const pan2 = { type: "Pan2", rate: "audio", props: [ a, b, 0.5 ] };

    assert.deepEqual(node, [
      { type: "OutputProxy", rate: "audio", props: [ pan2, 0, 2 ] },
      { type: "OutputProxy", rate: "audio", props: [ pan2, 1, 2 ] },
    ]);
  });

  it(".ar should create audio rate node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "control", [ 1, 0 ]);
    const node = Pan2.ar(a, b, 0.5);

    assert(Array.isArray(node) && node.length === 2);
    assert(isSCNode(node[0]));
    assert(isSCNode(node[1]));

    const pan2 = { type: "Pan2", rate: "audio", props: [ a, b, 0.5 ] };

    assert.deepEqual(node, [
      { type: "OutputProxy", rate: "audio", props: [ pan2, 0, 2 ] },
      { type: "OutputProxy", rate: "audio", props: [ pan2, 1, 2 ] },
    ]);
  });

  it(".kr should create control rate node", () => {
    const a = createNode("LFPar", "control", [ 440, 0 ]);
    const b = createNode("LFPar", "control", [ 1, 0 ]);
    const node = Pan2.kr(a, b, 0.5);

    assert(Array.isArray(node) && node.length === 2);
    assert(isSCNode(node[0]));
    assert(isSCNode(node[1]));

    const pan2 = { type: "Pan2", rate: "control", props: [ a, b, 0.5 ] };

    assert.deepEqual(node, [
      { type: "OutputProxy", rate: "control", props: [ pan2, 0, 2 ] },
      { type: "OutputProxy", rate: "control", props: [ pan2, 1, 2 ] },
    ]);
  });
});
