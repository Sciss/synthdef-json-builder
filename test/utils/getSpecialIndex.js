"use strict";

const assert = require("assert");
const getSpecialIndex = require("../../src/utils/getSpecialIndex");

describe("utils/opIndex(opName)", () => {
  it("convert to index of UnaryOpUGen", () => {
    const node = getSpecialIndex("abs");

    assert.deepEqual(node, { type: "UnaryOpUGen", specialIndex: 5 });
  });

  it("convert to index of BinaryOpUGen", () => {
    const node = getSpecialIndex("*");

    assert.deepEqual(node, { type: "BinaryOpUGen", specialIndex: 2 });
  });

  it("return null when unknown index", () => {
    const node = getSpecialIndex("SinOsc");

    assert.deepEqual(node, { type: "SinOsc", specialIndex: 0 });
  });
});
