"use strict";

const assert = require("assert");
const Line = require("../../../src/api/units/Line");
const isSCNode = require("../../../src/utils/isSCNode");

describe("units/Line(start, end, dur, doneAction, mul, add)", () => {
  it("default rate is control", () => {
    const node = Line(1, 0, 5, 2);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "Line", rate: "control", props: [ 1, 0, 5, 2 ]
    });
  });

  it(".ar should create audio rate node", () => {
    const node = Line.ar(1, 0, 5, 2);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "Line", rate: "audio", props: [ 1, 0, 5, 2 ]
    });
  });

  it(".kr should create audio rate node", () => {
    const node = Line.kr(1, 0, 5, 2);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "Line", rate: "control", props: [ 1, 0, 5, 2 ]
    });
  });
});
