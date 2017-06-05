"use strict";

const assert = require("assert");
const wrapAt = require("../../src/utils/wrapAt");

describe("utils/wrapAt(list, index)", () => {
  it("should return a value at wrapped index in the list", () => {
    const a = [ 0, 10, 20, 30 ];

    assert(wrapAt(a, 0) === 0);
    assert(wrapAt(a, 4) === 0);
    assert(wrapAt(a, 5) === 10);
  });

  it("should return directly when given a scalar", () => {
    assert(wrapAt(10, 0) === 10);
  });
})
