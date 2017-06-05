"use strict";

const assert = require("assert");
const createNode = require("../../src/utils/createNode");
const isSCNode = require("../../src/utils/isSCNode");
const checkSameRate = require("../../src/utils/checkSameRate");

describe("utils/checkSameRate(n)", () => {
  it("should create sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const createNodeIfCheckSameRate = checkSameRate(0, createNode);
    const node = createNodeIfCheckSameRate("LPF", "audio", [ a, 1000 ]);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "LPF", rate: "audio", props: [ a, 1000 ]
    })
  });

  it("should throw TypeError when given different rate input", () => {
    const a = createNode("SinOsc", "control", [ 440, 0 ]);
    const createNodeIfCheckSameRate = checkSameRate(0, createNode);

    assert.throws(() => {
      createNodeIfCheckSameRate("LPF", "audio", [ a, 1000 ]);
    }, TypeError);
  });
});
