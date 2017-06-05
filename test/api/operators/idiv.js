"use strict";

const assert = require("assert");
const idiv = require("../../../src/api/operators/idiv");
const createNode = require("../../../src/utils/createNode");
const isSCNode = require("../../../src/utils/isSCNode");
const getSpecialIndex = require("../../../src/utils/getSpecialIndex");

describe("operators/idiv(a, b)", () => {
  it("number", () => {
    const a = 10;
    const b = 20;
    const node = idiv(a, b);

    assert(node === Math.floor(a / b));
  });

  it("SCNode", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = 880;
    const node = idiv(a, b);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "//", rate: "audio", props: [ a, b ]
    });
    assert.deepEqual(getSpecialIndex(node.type), {
      type: "BinaryOpUGen", specialIndex: 4
    });
  });
});
