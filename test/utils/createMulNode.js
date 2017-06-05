"use strict";

const assert = require("assert");
const createNode = require("../../src/utils/createNode");
const isSCNode = require("../../src/utils/isSCNode");
const createMulNode = require("../../src/utils/createMulNode");

describe("utils/createMulNode", () => {
  it("should return number when given numeric only", () => {
    const node = createMulNode(2, 5);

    assert(node === 10);
  });

  it("a * 0 = 0", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = createMulNode(a, 0);

    assert(node === 0);
  });

  it("a * 1 = a", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = createMulNode(a, 1);

    assert(node === a);
  });

  it("a * 2 = *(a, 2)", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = createMulNode(a, 2);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "*", rate: "audio", props: [ a, 2 ]
    });
  });


  it("((a * 2) * 4) = *(a, 8)", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = createMulNode(createMulNode(a, 2), 4);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "*", rate: "audio", props: [ a, 2 * 4 ]
    });
  });

  it("should sort items by rate", () => {
    const a = createNode("SinOsc", "control", [ 440, 0 ]);
    const b = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = createMulNode(a, b);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "*", rate: "audio", props: [ b, a ]
    });
  });
});
