"use strict";

const assert = require("assert");
const createNode = require("../../src/utils/createNode");
const isSCNode = require("../../src/utils/isSCNode");

describe("utils/isSCNode(value)", () => {
  it("should return true when given a sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = JSON.parse(JSON.stringify(a)); // to PlainObject

    assert(isSCNode(a) === true);
    assert(isSCNode(b) === false);
  });
});
