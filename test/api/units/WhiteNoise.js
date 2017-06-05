"use strict";

const assert = require("assert");
const WhiteNoise = require("../../../src/api/units/WhiteNoise");
const isSCNode = require("../../../src/utils/isSCNode");

describe("units/WhiteNoise(mul, add)", () => {
  it("default rate is audio", () => {
    const node = WhiteNoise();

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: node.type, rate: "audio", props: []
    });
  });

  it("has different identifier each instance", () => {
    const node1 = WhiteNoise();
    const node2 = WhiteNoise();

    assert(/^WhiteNoise~\d+$/.test(node1.type));
    assert(/^WhiteNoise~\d+$/.test(node2.type));
    assert(node1.type !== node2.type);
  });

  it(".ar should create audio rate node", () => {
    const node = WhiteNoise.ar();

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: node.type, rate: "audio", props: []
    });
  });

  it(".kr should create control rate node", () => {
    const node = WhiteNoise.kr();

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: node.type, rate: "control", props: []
    });
  });
});
