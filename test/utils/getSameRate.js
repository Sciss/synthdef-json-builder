"use strict";

const assert = require("assert");
const createNode = require("../../src/utils/createNode");
const getSameRate = require("../../src/utils/getSameRate");

describe("utils/getSameRate(n, allowed)", () => {
  it("should create sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const pick = getSameRate(0, [ "audio", "control" ]);
    const node = createNode("LPF", pick, [ a, 1000 ]);

    assert(node.rate === "audio");
  });
  it("should throw TypeError when given invalid rate", () => {
    const a = createNode("DC", "scalar", [ 0 ]);
    const pick = getSameRate(0, [ "audio", "control" ]);

    assert.throws(() => {
      createNode("LPF", pick, [ a, 1000 ]);
    }, TypeError);
  });
});
