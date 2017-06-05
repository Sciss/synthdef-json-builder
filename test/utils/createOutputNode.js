"use strict";

const assert = require("assert");
const createNode = require("../../src/utils/createNode");
const isSCNode = require("../../src/utils/isSCNode");
const createOutputNode = require("../../src/utils/createOutputNode");

describe("utils/createOutputNode(items)", () => {
  it("should return 0 node", () => {
    const node = createOutputNode([
      createNode("Out", "audio", [ 0 ]), createNode("Out", "audio", [ 1 ]),
    ]);

    assert(isSCNode(node));
    assert(node.toUnitInput() === 0);
    assert.deepEqual(node.props[0], {
      type: "Out", rate: "audio", props: [ 0 ]
    });
    assert.deepEqual(node.props[1], {
      type: "Out", rate: "audio", props: [ 1 ]
    });
  });
});
