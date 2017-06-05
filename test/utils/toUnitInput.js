"use strict";

const assert = require("assert");
const toUnitInput = require("../../src/utils/toUnitInput");

describe("utils/toUnitInput(value)", () => {
  it("should call .toUnitInput() if exists", () => {
    const val = { toUnitInput: () => 100 };

    assert(toUnitInput(100) === 100);
    assert(toUnitInput(val) === 100);
    assert(toUnitInput(null) === null);
  });
});
