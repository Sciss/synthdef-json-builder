"use strict";

const createRef = require("./createRef");
const isSCNode = require("./isSCNode");
const isSCRef = require("./isSCRef");
const isNumber = require("./isNumber");
const toUnitInput = require("./toUnitInput");

function createNode(type, rate, props = []) {
  if (/\w~$/.test(type)) {
    type += Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  if (props.some(isSCRef)) {
    return createRef(() => createNode(type, rate, props.map(toUnitInput)));
  }

  props = props.map(toUnitInput);

  if (props.some(isNotValidInput)) {
    throw new TypeError(`
      node[${ type }] required number or sc.node, but got ${ JSON.stringify(props) }.
    `.trim());
  }

  if (typeof rate === "function") {
    rate = rate(type, null, props);
  }

  const node = Object.assign(Object.create({}), { type, rate, props });

  Object.defineProperties(node, {
    $$typeof: {
      value: "sc.node",
      enumerable: false, writable: true, configurable: true
    },
  });

  return node;
}

function isNotValidInput(value) {
  return !(isNumber(value) || isSCNode(value));
}

module.exports = createNode;
