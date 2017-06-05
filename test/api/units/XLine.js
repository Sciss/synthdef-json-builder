"use strict";

const assert = require("assert");
const XLine = require("../../../src/api/units/XLine");
const isSCNode = require("../../../src/utils/isSCNode");

describe("units/XLine(start, end, dur, doneAction, mul, add)", () => {
  it("default rate is control", () => {
    const node = XLine(1, 0, 5, 2);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "XLine", rate: "control", props: [ 1, 0, 5, 2 ]
    });
  });

  it(".ar should create audio rate node", () => {
    const node = XLine.ar(1, 0, 5, 2);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "XLine", rate: "audio", props: [ 1, 0, 5, 2 ]
    });
  });

  it(".kr should create audio rate node", () => {
    const node = XLine.kr(1, 0, 5, 2);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "XLine", rate: "control", props: [ 1, 0, 5, 2 ]
    });
  });
});
