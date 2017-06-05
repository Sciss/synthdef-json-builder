"use strict";

const assert = require("assert");
const SinOsc = require("../../../src/api/units/SinOsc");
const isSCNode = require("../../../src/utils/isSCNode");

describe("units/SinOsc(freq, phase, mul, add)", () => {
  it("default rate is audio", () => {
    const node = SinOsc(880);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "SinOsc", rate: "audio", props: [ 880, 0 ]
    });
  });

  it(".ar should create audio rate node", () => {
    const node = SinOsc.ar(880);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "SinOsc", rate: "audio", props: [ 880, 0 ]
    });
  });

  it(".kr should create control rate node", () => {
    const node = SinOsc.kr(880);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "SinOsc", rate: "control", props: [ 880, 0 ]
    });
  });
});
