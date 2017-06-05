"use strict";

const assert = require("assert");
const createRef = require("../../src/utils/createRef");
const isSCRef = require("../../src/utils/isSCRef");

describe("utils/createRef(value)", () => {
  it("should return true when given a sc.ref", () => {
    const a = createRef(() => 100);
    const b = () => 100;

    assert(isSCRef(a) === true);
    assert(isSCRef(b) === false);
  });
});
