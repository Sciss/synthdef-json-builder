"use strict";

const assert = require("assert");
const add = require("../../../src/api/operators/add");
const createNode = require("../../../src/utils/createNode");
const isSCNode = require("../../../src/utils/isSCNode");
const getSpecialIndex = require("../../../src/utils/getSpecialIndex");

describe("operators/add(a, b)", () => {
  it("number", () => {
    const a = 10;
    const b = 20;
    const node = add(a, b);

    assert(node === (a + b));
  });

  it("SCNode", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = 880;
    const node = add(a, b);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "+", rate: "audio", props: [ a, b ]
    });
    assert.deepEqual(getSpecialIndex(node.type), {
      type: "BinaryOpUGen", specialIndex: 0
    });
  });
});
