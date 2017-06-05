"use strict";

const assert = require("assert");
const madd = require("../../../src/api/operators/madd");
const createNode = require("../../../src/utils/createNode");
const isSCNode = require("../../../src/utils/isSCNode");

describe("operators/madd(a, b, c)", () => {
  it("number", () => {
    const a = 10;
    const b = 20;
    const c = 30;
    const node = madd(a, b, c);

    assert(node === (a * b + c));
  });

  it("SCNode", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "control", [ 5, 0 ]);
    const c = 880;
    const node = madd(a, b, c);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "MulAdd", rate: "audio", props: [ a, b, c ]
    });
  });
});
