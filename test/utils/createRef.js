"use strict";

const assert = require("assert");
const createRef = require("../../src/utils/createRef");
const isSCRef = require("../../src/utils/isSCRef");
const toUnitInput = require("../../src/utils/toUnitInput");

describe("utils/createRef(value)", () => {
  it("should create a sc.ref", () => {
    const a = createRef(100);

    assert(a !== 100);
    assert(toUnitInput(a) === 100);
    assert(isSCRef(a));
  });

  it("should bless sc.ref flag when given a function", () => {
    const fn = () => 100;
    const a = createRef(fn);

    assert(a === fn);
    assert(toUnitInput(a) === 100);
    assert(isSCRef(a));
  });

  it("should throw TypeError when given function that need arguments", () => {
    const fn = a => a;

    assert.throws(() => {
      createRef(fn);
    }, TypeError);
  });
});
