"use strict";

const assert = require("assert");
const ref = require("../../../src/api/api/ref");
const isSCRef = require("../../../src/utils/isSCRef");
const toUnitInput = require("../../../src/utils/toUnitInput");

describe("api/ref(value)", () => {
  it("should create a sc.ref", () => {
    const a = [ 100, 200 ];
    const b = ref(a);

    assert(isSCRef(b));
    assert(toUnitInput(b) === a);
  });

  it("is an unbinded function", () => {
    const a = [ 100, 200 ];
    const b = a::ref();

    assert(isSCRef(b));
    assert(toUnitInput(b) === a);
  });
});
