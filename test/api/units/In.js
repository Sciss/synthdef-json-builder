"use strict";

const assert = require("assert");
const In = require("../../../src/api/units/In");
const isSCNode = require("../../../src/utils/isSCNode");

describe("units/In(ch, bus)", () => {
  it("default rate is audio", () => {
    const node = In(0, 2);

    assert(Array.isArray(node) && node.length === 2);
    assert(isSCNode(node[0]));
    assert(isSCNode(node[1]));

    const in_ = { type: "In", rate: "audio", props: [ 0 ] };

    assert.deepEqual(node, [
      { type: "OutputProxy", rate: "audio", props: [ in_, 0, 2 ] },
      { type: "OutputProxy", rate: "audio", props: [ in_, 1, 2 ] },
    ]);
  });

  it("should handle nested output", () => {
    const node = In([ 0, 2, 4 ], 2);

    assert(Array.isArray(node) && node.length === 3);
    assert(Array.isArray(node[0]) && node[0].length === 2);
    assert(Array.isArray(node[1]) && node[1].length === 2);
    assert(Array.isArray(node[2]) && node[2].length === 2);
    assert(isSCNode(node[0][0]));
    assert(isSCNode(node[0][1]));
    assert(isSCNode(node[1][0]));
    assert(isSCNode(node[1][1]));
    assert(isSCNode(node[2][0]));
    assert(isSCNode(node[2][1]));

    const in0 = { type: "In", rate: "audio", props: [ 0 ] };
    const in2 = { type: "In", rate: "audio", props: [ 2 ] };
    const in4 = { type: "In", rate: "audio", props: [ 4 ] };

    assert.deepEqual(node[0], [
      { type: "OutputProxy", rate: "audio", props: [ in0, 0, 2 ] },
      { type: "OutputProxy", rate: "audio", props: [ in0, 1, 2 ] },
    ]);
    assert.deepEqual(node[1], [
      { type: "OutputProxy", rate: "audio", props: [ in2, 0, 2 ] },
      { type: "OutputProxy", rate: "audio", props: [ in2, 1, 2 ] },
    ]);
    assert.deepEqual(node[2], [
      { type: "OutputProxy", rate: "audio", props: [ in4, 0, 2 ] },
      { type: "OutputProxy", rate: "audio", props: [ in4, 1, 2 ] },
    ]);
  });

  it(".ar should create audio node", () => {
    const node = In.ar(0, 2);

    assert(Array.isArray(node) && node.length === 2);
    assert(isSCNode(node[0]));
    assert(isSCNode(node[1]));

    const in_ = { type: "In", rate: "audio", props: [ 0 ] };

    assert.deepEqual(node, [
      { type: "OutputProxy", rate: "audio", props: [ in_, 0, 2 ] },
      { type: "OutputProxy", rate: "audio", props: [ in_, 1, 2 ] },
    ]);
  });

  it(".kr should create control node", () => {
    const node = In.kr(0, 2);

    assert(Array.isArray(node) && node.length === 2);
    assert(isSCNode(node[0]));
    assert(isSCNode(node[1]));

    const in_ = { type: "In", rate: "control", props: [ 0 ] };

    assert.deepEqual(node, [
      { type: "OutputProxy", rate: "control", props: [ in_, 0, 2 ] },
      { type: "OutputProxy", rate: "control", props: [ in_, 1, 2 ] },
    ]);
  });
});
